import { randomUUID } from "crypto";
import { XuiService } from "./xui.service.js";
import { PaymentService } from "./payment.service.js";

export const ClientService = {
  addClientWithPayment: async (data: {
    inboundId: string;
    email: string;
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
  }) => {
    const clientId = randomUUID();
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
          id: clientId,
          email: data.email,
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

    const response = await XuiService.addClientRaw(formData);

    if (!response.data.success) {
      throw new Error(response.data.msg || "Failed to add client in X-UI");
    }

    const cycleEnd = finalExpiryTime > 0 ? new Date(finalExpiryTime) : null;
    const isPaid = data.paymentStatus === "PAID" || data.paymentStatus === "Paid";

    await PaymentService.createPayment({
      clientEmail: data.email,
      inboundId: parseInt(data.inboundId),
      quotaGB: data.totalGB || null,
      amountPaid: data.amountPaid || 0,
      paymentDate: isPaid ? new Date() : null,
      status: isPaid ? "PAID" : "UNPAID",
      cycleStart: new Date(),
      cycleEnd,
      isNewClient: true,
      notes: data.paymentNotes || null,
    });

    return { clientId, subId };
  },

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
          email: data.email,
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

    if (!response.data.success) {
      throw new Error(response.data.msg || "Failed to update client in X-UI");
    }
  },

  deleteClientConfig: async (inboundId: number, clientId: string) => {
    const response = await XuiService.deleteClientRaw(inboundId, clientId);
    if (!response.data.success) {
      throw new Error(response.data.msg || "Failed to delete client in X-UI");
    }
  },

  resetClientCycleWithPayment: async (data: any) => {
    const resetResponse = await XuiService.resetClientTrafficRaw(data.inboundId, data.email);
    if (!resetResponse.data.success) {
      throw new Error(resetResponse.data.msg || "Failed to reset traffic in X-UI");
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
            subId: "",
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

    const cycleEnd = finalExpiryTime > 0 ? new Date(finalExpiryTime) : null;
    const isPaid = data.paid === true;

    const payment = await PaymentService.createPayment({
      clientEmail: data.email,
      inboundId: parseInt(data.inboundId),
      quotaGB: data.totalGB || null,
      amountPaid: data.amountPaid || 0,
      status: isPaid ? "PAID" : "UNPAID",
      paymentDate: isPaid ? new Date() : null,
      cycleStart: new Date(),
      cycleEnd: cycleEnd,
      isNewClient: true,
      presetId: data.presetId || null,
      notes: "New cycle - traffic reset",
    });

    return { payment, isPaid };
  }
};
