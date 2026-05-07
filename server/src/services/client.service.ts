import { randomUUID } from "crypto";
import { XuiService } from "./xui.service.js";
import { PaymentService } from "./payment.service.js";
import prisma from "../config/prisma.js";
import { AppError } from "../utils/AppError.js";

export const ClientService = {
  // sync: reconcile xui panel with local service records 
  syncPanelToDb: async () => {
    try {
      const response = await XuiService.getInbounds();
      if (!response.data.success) return;

      const panelClients: any[] = [];
      response.data.obj.forEach((inbound: any) => {
        const stats = inbound.clientStats || [];
        let settingsClients: any[] = [];
        try {
          const settings = JSON.parse(inbound.settings || "{}");
          settingsClients = settings.clients || [];
        } catch {}

        stats.forEach((s: any) => {
          const settingClient = settingsClients.find((sc: any) => sc.email === s.email);
          const clientId = settingClient?.id || settingClient?.password || s.id.toString();
          panelClients.push({
            xuiId: clientId.toString(),
            xuiEmail: s.email,
            inboundId: s.inboundId,
          });
        });
      });

      // remove service records whose xui tunnel no longer exists
      const dbServices = await prisma.service.findMany();

      for (const svc of dbServices) {
        const exactMatch = panelClients.find((pc: any) => pc.xuiId === svc.xuiId);
        
        if (!exactMatch) {
          // try to heal by email + inbound
          const potentialHeal = panelClients.find((pc: any) => pc.xuiEmail === svc.xuiEmail && pc.inboundId === svc.inboundId);
          
          if (potentialHeal) {
            await prisma.service.update({
              where: { id: svc.id },
              data: { xuiId: potentialHeal.xuiId }
            });
            console.log(`[Sync] Healed Service ID for ${svc.xuiEmail}: ${svc.xuiId} -> ${potentialHeal.xuiId}`);
            // update in-memory to prevent recreation
            svc.xuiId = potentialHeal.xuiId;
          } else {
            await prisma.service.delete({ where: { id: svc.id } });
            console.log(`[Sync] Removed stale Service record for XUI ${svc.xuiEmail} (${svc.xuiId})`);
          }
        } else if (exactMatch.xuiEmail !== svc.xuiEmail) {
          // heal name if changed in xui
          await prisma.service.update({
            where: { id: svc.id },
            data: { xuiEmail: exactMatch.xuiEmail },
          });
        }
      }

      // create service records for xui clients that aren't tracked yet
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
          console.log(`[Sync] Created Service record for untracked XUI client ${pc.xuiEmail}`);
        }
      }
    } catch (error) {
      console.error("[Sync] Reconciliation failed:", error);
    }
  },

  // add client: create in xui + optionally link customer
  addClientWithPayment: async (data: {
    inboundId: string;
    xuiEmail: string;
    email?: string; // customer email (optional)
    linkAction?: string; // "create" | "link" | "skip"
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
    customerName?: string; // name for new customer
  }) => {
    const xuiUUID = randomUUID();
    const subId = randomUUID().replace(/-/g, "").substring(0, 16);

    let finalExpiryTime = 0;
    if (data.startAfterFirstUse && data.startAfterFirstUseDays > 0) {
      finalExpiryTime = -(data.startAfterFirstUseDays * 24 * 60 * 60 * 1000);
    } else if (data.expiryTime) {
      finalExpiryTime = new Date(data.expiryTime).getTime();
    }

    const clientSettings = {
      clients: [
        {
          id: xuiUUID,
          email: data.xuiEmail,
          limitIp: data.limitIp || 0,
          totalGB: data.totalGB ? data.totalGB * 1073741824 : 0,
          expiryTime: finalExpiryTime,
          enable: data.enable !== false,
          tgId: 0,
          subId: subId,
          comment: data.comment || "",
          reset: 0,
          flow: data.flow || "",
        },
      ],
    };

    const formData = new URLSearchParams();
    formData.append("id", data.inboundId);
    formData.append("settings", JSON.stringify(clientSettings));

    // add to xui
    console.log(`[ClientService] Adding client ${data.xuiEmail} to XUI inbound ${data.inboundId}`);
    const response = await XuiService.addClientRaw(formData);

    if (!response || !response.data) {
      throw new AppError("No response from XUI panel", 500);
    }
    if (!response.data.success) {
      throw new AppError(response.data.msg || "Failed to add client in X-UI", 400);
    }

    // create service record
    let customerId: string | null = null;

    if (data.linkAction === "link" && (data.email || data.customerName)) {
      // find by email or name
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
      // create new customer with name and optional email
      const newCustomer = await prisma.customer.create({
        data: { 
          email: data.email || null,
          name: data.customerName || data.xuiEmail
        } as any,
      });
      customerId = newCustomer.id;
      console.log(`[ClientService] Created new Customer: ${data.customerName || data.email}`);
    }

    const service = await prisma.service.create({
      data: {
        xuiId: xuiUUID,
        xuiEmail: data.xuiEmail,
        inboundId: parseInt(data.inboundId.toString()),
        customerId,
        status: "ACTIVE",
      },
    });

    // record payment (only if linked to a customer)
    if (customerId) {
      const cycleEnd = finalExpiryTime > 0 ? new Date(finalExpiryTime) : null;
      const isPaid = data.paymentStatus === "PAID" || data.paymentStatus === "Paid";

      await PaymentService.createPayment({
        customerEmail: data.email || null,
        customerId,
        inboundId: parseInt(data.inboundId.toString()),
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

  // check customer: lookup for link dialog in frontend
  checkCustomerEmail: async (email: string) => {
    const customer = await prisma.customer.findFirst({
      where: { 
        OR: [
          { email },
          { name: email }
        ]
      } as any,
      include: {
        services: { where: { status: "ACTIVE" }, select: { id: true, xuiEmail: true, inboundId: true } },
        _count: { select: { payments: true } },
      } as any,
    }) as any;

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

  // link/ unlink customer to/from a service
  linkCustomer: async (serviceXuiId: string, email: string, inboundId?: number) => {
    const service = await prisma.service.findFirst({ 
      where: { 
        xuiId: serviceXuiId,
        ...(inboundId ? { inboundId } : {})
      } 
    });
    if (!service) throw new AppError("Service not found", 404);

    // find or create customer
    const isEmail = email.includes("@");
    let customer = await prisma.customer.findFirst({
      where: isEmail ? { email } : { name: email }
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: isEmail ? { email } : { name: email }
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
        ...(inboundId ? { inboundId } : {})
      } 
    });
    if (!service) throw new AppError("Service not found", 404);

    await prisma.service.update({
      where: { id: service.id },
      data: { customerId: null },
    });

    return { serviceId: service.id };
  },

  // update client: update in xui + sync service
  updateClientConfig: async (data: any) => {
    let finalExpiryTime = 0;
    if (data.startAfterFirstUse && data.startAfterFirstUseDays > 0) {
      finalExpiryTime = -(data.startAfterFirstUseDays * 24 * 60 * 60 * 1000);
    } else if (data.expiryTime) {
      finalExpiryTime = new Date(data.expiryTime).getTime();
    }

    const clientSettings = {
      clients: [
        {
          id: data.clientId,
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
        },
      ],
    };

    const formData = new URLSearchParams();
    formData.append("id", data.inboundId);
    formData.append("settings", JSON.stringify(clientSettings));

    const response = await XuiService.updateClientRaw(data.clientId, formData);
    if (!response || !response.data) {
      throw new AppError("No response from XUI panel", 500);
    }
    if (!response.data.success) {
      throw new AppError(response.data.msg || "Failed to update client in X-UI", 400);
    }

    // update the service record's xuiEmail
    try {
      await prisma.service.updateMany({
        where: { xuiId: data.clientId },
        data: { xuiEmail: data.xuiEmail },
      });
    } catch (error: any) {
      if (error.code === "P2025") {
        // service record doesn't exist yet; create it
        await prisma.service.create({
          data: {
            xuiId: data.clientId,
            xuiEmail: data.xuiEmail,
            inboundId: parseInt(data.inboundId.toString()),
            status: "ACTIVE",
          },
        });
      } else {
        throw error;
      }
    }
  },

  // delete client: remove from xui + remove service
  deleteClientConfig: async (inboundId: number, clientId: string) => {
    // remove from xui
    const response = await XuiService.deleteClientRaw(inboundId, clientId);
    if (!response.data.success) {
      throw new AppError(response.data.msg || "Failed to delete client in X-UI", 400);
    }

    // remove the service record (customer record stays for history)
    try {
      await prisma.service.deleteMany({ where: { xuiId: clientId } });
      console.log(`[ClientService] Deleted Service record for XUI ${clientId}`);
    } catch {
      console.log(`[ClientService] No Service record found for XUI ${clientId}, ignoring.`);
    }
  },

  // reset cycle: reset traffic + create new payment
  resetClientCycleWithPayment: async (data: any) => {
    const resetResponse = await XuiService.resetClientTrafficRaw(data.inboundId, data.email);
    if (!resetResponse.data.success) {
      throw new AppError(resetResponse.data.msg || "Failed to reset traffic in X-UI", 400);
    }

    let finalExpiryTime = 0;
    if (data.startAfterFirstUse && data.startAfterFirstUseDays > 0) {
      finalExpiryTime = -(data.startAfterFirstUseDays * 24 * 60 * 60 * 1000);
    } else if (data.expiryTime) {
      finalExpiryTime = new Date(data.expiryTime).getTime();
    }

    if (data.totalGB || data.expiryTime || data.startAfterFirstUse) {
      const clientSettings = {
        clients: [
          {
            id: data.clientId,
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
          },
        ],
      };

      const formData = new URLSearchParams();
      formData.append("id", data.inboundId);
      formData.append("settings", JSON.stringify(clientSettings));
      await XuiService.updateClientRaw(data.clientId, formData);
    }

    // find the service and its linked customer
    const service = (await prisma.service.findFirst({
      where: { xuiId: data.clientId },
      include: { customer: true },
    })) as any;

    if (!service?.customer) {
      throw new AppError("This client is not linked to a customer account. Cannot create payment.", 400);
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
      cycleEnd: cycleEnd,
      isNewClient: false,
      presetId: data.presetId || null,
      notes: "New cycle - traffic reset",
    });

    return { payment, isPaid };
  },
};
