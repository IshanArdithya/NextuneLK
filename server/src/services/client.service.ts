import { randomUUID } from "crypto";
import { parseJsonField } from "../lib/xui-client.js";
import { XuiService } from "./xui.service.js";
import { PaymentService } from "./payment.service.js";
import prisma from "../config/prisma.js";
import { AppError } from "../utils/AppError.js";

const resolvePanelClientId = (client: any) =>
  client?.uuid || client?.id || client?.password || "";

export const ClientService = {
  syncPanelToDb: async () => {
    try {
      const response = await XuiService.getInbounds();
      if (!response.data.success) return;

      const panelClients: any[] = [];

      try {
        const clientsRes = await XuiService.getClientsList();
        if (clientsRes?.data?.success && Array.isArray(clientsRes.data.obj)) {
          for (const client of clientsRes.data.obj) {
            const clientId = resolvePanelClientId(client);
            if (!clientId) continue;
            for (const inboundId of client.inboundIds || []) {
              panelClients.push({
                xuiId: clientId.toString(),
                xuiEmail: client.email,
                inboundId,
              });
            }
          }
        }
      } catch {
        // fallback: parse from inbound list
        response.data.obj.forEach((inbound: any) => {
          const stats = inbound.clientStats || [];
          const settingsClients = parseInboundClients(inbound);

          stats.forEach((s: any) => {
            const settingClient = settingsClients.find(
              (sc: any) => sc.email === s.email
            );
            const clientId =
              settingClient?.id ||
              settingClient?.password ||
              s.uuid ||
              s.id.toString();
            panelClients.push({
              xuiId: clientId.toString(),
              xuiEmail: s.email,
              inboundId: s.inboundId,
            });
          });
        });
      }

      const dbServices = await prisma.service.findMany();

      for (const svc of dbServices) {
        const exactMatch = panelClients.find((pc: any) => pc.xuiId === svc.xuiId);

        if (!exactMatch) {
          const potentialHeal = panelClients.find(
            (pc: any) =>
              pc.xuiEmail === svc.xuiEmail && pc.inboundId === svc.inboundId
          );

          if (potentialHeal) {
            await prisma.service.update({
              where: { id: svc.id },
              data: { xuiId: potentialHeal.xuiId },
            });
            console.log(
              `[Sync] Healed Service ID for ${svc.xuiEmail}: ${svc.xuiId} -> ${potentialHeal.xuiId}`
            );
            svc.xuiId = potentialHeal.xuiId;
          } else {
            await prisma.service.delete({ where: { id: svc.id } });
            console.log(
              `[Sync] Removed stale Service record for XUI ${svc.xuiEmail} (${svc.xuiId})`
            );
          }
        } else if (exactMatch.xuiEmail !== svc.xuiEmail) {
          await prisma.service.update({
            where: { id: svc.id },
            data: { xuiEmail: exactMatch.xuiEmail },
          });
        }
      }

      for (const pc of panelClients) {
        const exists = dbServices.some((s: any) => s.xuiId === pc.xuiId);
        if (!exists) {
          await prisma.service.create({
            data: {
              xuiId: pc.xuiId,
              xuiEmail: pc.xuiEmail,
              inboundId: pc.inboundId,
              status: "ACTIVE",
            },
          });
          console.log(
            `[Sync] Created Service record for untracked XUI client ${pc.xuiEmail}`
          );
        }
      }
    } catch (error) {
      console.error("[Sync] Reconciliation failed:", error);
    }
  },

  addClientWithPayment: async (data: {
    inboundId: string;
    xuiEmail: string;
    email?: string;
    linkAction?: string;
    totalGB: number;
    expiryTime: string | null;
    startAfterFirstUse: boolean;
    startAfterFirstUseDays: number;
    enable: boolean;
    limitIp: number;
    flow: string;
    comment: string;
    amountPaid: number;
    paymentStatus: string;
    paymentNotes: string;
    presetId?: string;
    customerName?: string;
  }) => {
    const subId = randomUUID().replace(/-/g, "").substring(0, 16);

    let finalExpiryTime = 0;
    if (data.startAfterFirstUse && data.startAfterFirstUseDays > 0) {
      finalExpiryTime = -(data.startAfterFirstUseDays * 24 * 60 * 60 * 1000);
    } else if (data.expiryTime) {
      finalExpiryTime = new Date(data.expiryTime).getTime();
    }

    const inboundId = parseInt(data.inboundId.toString(), 10);

    console.log(
      `[ClientService] Adding client ${data.xuiEmail} to XUI inbound ${inboundId}`
    );
    const response = await XuiService.addClientRaw({
      client: {
        email: data.xuiEmail,
        limitIp: data.limitIp || 0,
        totalGB: data.totalGB ? data.totalGB * 1073741824 : 0,
        expiryTime: finalExpiryTime,
        enable: data.enable !== false,
        tgId: 0,
        subId,
        comment: data.comment || "",
        reset: 0,
        flow: data.flow || "",
      },
      inboundIds: [inboundId],
    });

    if (!response?.data) {
      throw new AppError("No response from XUI panel", 500);
    }
    if (!response.data.success) {
      throw new AppError(response.data.msg || "Failed to add client in X-UI", 400);
    }

    const created = await XuiService.getClientRaw(data.xuiEmail);
    const xuiUUID = resolvePanelClientId(created?.data?.obj);
    if (!xuiUUID) {
      throw new AppError(
        "Client was created but UUID could not be retrieved from panel",
        500
      );
    }

    let customerId: string | null = null;

    if (data.linkAction === "link" && (data.email || data.customerName)) {
      const existingCustomer = await prisma.customer.findFirst({
        where: {
          OR: [
            ...(data.email ? [{ email: data.email }] : []),
            ...(data.customerName ? [{ name: data.customerName }] : []),
          ],
        },
      });
      if (existingCustomer) customerId = existingCustomer.id;
    } else if (data.linkAction === "create") {
      const newCustomer = await prisma.customer.create({
        data: {
          email: data.email || null,
          name: data.customerName || data.xuiEmail,
        } as any,
      });
      customerId = newCustomer.id;
      console.log(
        `[ClientService] Created new Customer: ${data.customerName || data.email}`
      );
    }

    const service = await prisma.service.create({
      data: {
        xuiId: xuiUUID,
        xuiEmail: data.xuiEmail,
        inboundId,
        customerId,
        status: "ACTIVE",
      },
    });

    if (customerId) {
      const cycleEnd = finalExpiryTime > 0 ? new Date(finalExpiryTime) : null;
      const isPaid = data.paymentStatus === "PAID" || data.paymentStatus === "Paid";

      await PaymentService.createPayment({
        customerEmail: data.email || null,
        customerId,
        inboundId,
        quotaGB: data.totalGB || null,
        amountPaid: data.amountPaid || 0,
        paymentDate: isPaid ? new Date() : null,
        status: isPaid ? "PAID" : "UNPAID",
        cycleStart: new Date(),
        cycleEnd,
        isNewClient: true,
        notes: data.paymentNotes || null,
        presetId: data.presetId || null,
      });
    }

    return { clientId: xuiUUID, subId, serviceId: service.id, customerId };
  },

  checkCustomerEmail: async (email: string) => {
    const customer = (await prisma.customer.findFirst({
      where: {
        OR: [{ email }, { name: email }],
      } as any,
      include: {
        services: {
          where: { status: "ACTIVE" },
          select: { id: true, xuiEmail: true, inboundId: true },
        },
        _count: { select: { payments: true } },
      } as any,
    })) as any;

    if (!customer) {
      return { exists: false };
    }

    return {
      exists: true,
      customer: {
        id: customer.id,
        email: customer.email,
        name: customer.name,
        status: customer.status,
        activeServices: customer.services,
        totalPayments: customer._count.payments,
      },
    };
  },

  linkCustomer: async (serviceXuiId: string, email: string, inboundId?: number) => {
    const service = await prisma.service.findFirst({
      where: {
        xuiId: serviceXuiId,
        ...(inboundId ? { inboundId } : {}),
      },
    });
    if (!service) throw new AppError("Service not found", 404);

    const isEmail = email.includes("@");
    let customer = await prisma.customer.findFirst({
      where: isEmail ? { email } : { name: email },
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: isEmail ? { email } : { name: email },
      } as any);
    }

    await prisma.service.update({
      where: { id: service.id },
      data: { customerId: customer.id },
    });

    return { serviceId: service.id, customerId: customer.id };
  },

  unlinkCustomer: async (serviceXuiId: string, inboundId?: number) => {
    const service = await prisma.service.findFirst({
      where: {
        xuiId: serviceXuiId,
        ...(inboundId ? { inboundId } : {}),
      },
    });
    if (!service) throw new AppError("Service not found", 404);

    await prisma.service.update({
      where: { id: service.id },
      data: { customerId: null },
    });

    return { serviceId: service.id };
  },

  updateClientConfig: async (data: any) => {
    let finalExpiryTime = 0;
    if (data.startAfterFirstUse && data.startAfterFirstUseDays > 0) {
      finalExpiryTime = -(data.startAfterFirstUseDays * 24 * 60 * 60 * 1000);
    } else if (data.expiryTime) {
      finalExpiryTime = new Date(data.expiryTime).getTime();
    }

    const lookupEmail = data.originalEmail || data.xuiEmail;

    const response = await XuiService.updateClientRaw(lookupEmail, {
      email: data.xuiEmail,
      limitIp: data.limitIp || 0,
      totalGB: data.totalGB ? data.totalGB * 1073741824 : 0,
      expiryTime: finalExpiryTime,
      enable: data.enable !== false,
      tgId: data.tgId || 0,
      subId: data.subId || "",
      comment: data.comment || "",
      reset: data.reset || 0,
      flow: data.flow || "",
    });

    if (!response?.data) {
      throw new AppError("No response from XUI panel", 500);
    }
    if (!response.data.success) {
      throw new AppError(response.data.msg || "Failed to update client in X-UI", 400);
    }

    const updated = await XuiService.getClientRaw(data.xuiEmail);
    const xuiId = resolvePanelClientId(updated?.data?.obj) || data.clientId;

    try {
      await prisma.service.updateMany({
        where: { xuiId: data.clientId },
        data: { xuiEmail: data.xuiEmail, xuiId },
      });
    } catch (error: any) {
      if (error.code === "P2025") {
        await prisma.service.create({
          data: {
            xuiId,
            xuiEmail: data.xuiEmail,
            inboundId: parseInt(data.inboundId.toString(), 10),
            status: "ACTIVE",
          },
        });
      } else {
        throw error;
      }
    }
  },

  deleteClientConfig: async (
    inboundId: number,
    clientId: string,
    email?: string
  ) => {
    let clientEmail = email;
    if (!clientEmail) {
      const service = await prisma.service.findFirst({
        where: { xuiId: clientId, inboundId },
      });
      clientEmail = service?.xuiEmail;
    }

    if (!clientEmail) {
      throw new AppError(
        "Client email is required to delete from the panel",
        400
      );
    }

    const response = await XuiService.deleteClientRaw(clientEmail);
    if (!response.data.success) {
      throw new AppError(
        response.data.msg || "Failed to delete client in X-UI",
        400
      );
    }

    try {
      await prisma.service.deleteMany({ where: { xuiId: clientId } });
      console.log(`[ClientService] Deleted Service record for XUI ${clientId}`);
    } catch {
      console.log(
        `[ClientService] No Service record found for XUI ${clientId}, ignoring.`
      );
    }
  },

  resetClientCycleWithPayment: async (data: any) => {
    const resetResponse = await XuiService.resetClientTrafficRaw(data.email);
    if (!resetResponse.data.success) {
      throw new AppError(
        resetResponse.data.msg || "Failed to reset traffic in X-UI",
        400
      );
    }

    let finalExpiryTime = 0;
    if (data.startAfterFirstUse && data.startAfterFirstUseDays > 0) {
      finalExpiryTime = -(data.startAfterFirstUseDays * 24 * 60 * 60 * 1000);
    } else if (data.expiryTime) {
      finalExpiryTime = new Date(data.expiryTime).getTime();
    }

    if (data.totalGB || data.expiryTime || data.startAfterFirstUse) {
      await XuiService.updateClientRaw(data.email, {
        email: data.email,
        limitIp: 0,
        totalGB: data.totalGB ? data.totalGB * 1073741824 : 0,
        expiryTime: finalExpiryTime,
        enable: true,
        tgId: 0,
        subId: data.subId || "",
        comment: "",
        reset: 0,
        flow: "",
      });
    }

    const service = (await prisma.service.findFirst({
      where: { xuiId: data.clientId },
      include: { customer: true },
    })) as any;

    if (!service?.customer) {
      throw new AppError(
        "This client is not linked to a customer account. Cannot create payment.",
        400
      );
    }

    const cycleEnd = finalExpiryTime > 0 ? new Date(finalExpiryTime) : null;
    const isPaid = data.paid === true;

    const payment = await PaymentService.createPayment({
      customerEmail: service.customer.email,
      customerId: service.customer.id,
      inboundId: parseInt(data.inboundId),
      quotaGB: data.totalGB || null,
      amountPaid: data.amountPaid || 0,
      status: isPaid ? "PAID" : "UNPAID",
      paymentDate: isPaid ? new Date() : null,
      cycleStart: new Date(),
      cycleEnd,
      isNewClient: false,
      presetId: data.presetId || null,
      notes: "New cycle - traffic reset",
    });

    return { payment, isPaid };
  },
};

function parseInboundClients(inbound: any) {
  const settings = parseJsonField<{ clients?: any[] }>(inbound.settings);
  return settings.clients || [];
}
