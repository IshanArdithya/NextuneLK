import { ExternalApi } from "../lib/xui-client.js";

const externalApi = new ExternalApi();

// helpers

const formatBytes = (bytes: number) => {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(Math.abs(bytes)) / Math.log(1024));
  return (bytes / Math.pow(1024, i)).toFixed(2) + " " + units[i];
};

const parseClients = (inbound: any) => {
  try {
    const settings = JSON.parse(inbound.settings || "{}");
    return settings.clients || [];
  } catch {
    return [];
  }
};

const findClientStats = (clientStats: any[], email: string) => {
  if (!Array.isArray(clientStats)) return null;
  return clientStats.find((cs) => cs.email === email) || null;
};

// service methods

export const XuiService = {
  // session maintenance
  maintainSession: async () => {
    try {
      console.log("Running session maintenance...");
      await externalApi.login(true);
    } catch (error: any) {
      console.error("Session maintenance error:", error.response?.data?.msg || error.message);
    }
  },

  getSessionStatus: () => {
    return externalApi.getSessionStatus();
  },

  // raw api wrappers
  addClientRaw: async (formData: URLSearchParams) => {
    return externalApi.addClient(formData);
  },

  updateClientRaw: async (clientId: string, formData: URLSearchParams) => {
    return externalApi.updateClient(clientId, formData);
  },

  deleteClientRaw: async (inboundId: number, clientId: string) => {
    return externalApi.deleteClient(inboundId, clientId);
  },

  resetClientTrafficRaw: async (inboundId: number, email: string) => {
    return externalApi.resetClientTraffic(inboundId, email);
  },

  getServerStatus: async () => {
    return externalApi.getServerStatus();
  },

  getOnlineUsers: async () => {
    return externalApi.getOnlineUsers();
  },

  // processed data
  getEnrichedInbounds: async () => {
    const response = await externalApi.getInbounds();

    if (!response.data.success || !response.data.obj) {
      throw new Error(response.data.msg || "Failed to fetch inbounds");
    }

    let onlineUsers: string[] = [];
    try {
      const onlineRes = await externalApi.getOnlineUsers();
      if (onlineRes?.data?.success && Array.isArray(onlineRes.data.obj)) {
        onlineUsers = onlineRes.data.obj;
      }
    } catch {
      // ignore
    }

    const inbounds = response.data.obj.map((inbound: any) => {
      const clients = parseClients(inbound);
      const clientStats = inbound.clientStats || [];

      const enrichedClients = clients.map((client: any) => {
        const stats = findClientStats(clientStats, client.email);
        const up = stats?.up || 0;
        const down = stats?.down || 0;
        const totalUsed = up + down;
        const isOnline = onlineUsers.includes(client.email);

        let expiryInfo: any = { type: "unlimited", date: null, remaining: null };
        if (client.expiryTime < 0) {
          const durationMs = Math.abs(client.expiryTime);
          const days = Math.floor(durationMs / (1000 * 60 * 60 * 24));
          expiryInfo = { type: "after_first_use", durationDays: days, durationMs };
        } else if (client.expiryTime > 0) {
          const expiryDate = new Date(client.expiryTime);
          const now = new Date();
          const isExpired = expiryDate < now;
          const diffMs = expiryDate.getTime() - now.getTime();
          const remainingDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
          expiryInfo = {
            type: "fixed",
            date: expiryDate.toISOString(),
            isExpired,
            remainingDays: isExpired ? 0 : remainingDays,
          };
        }

        return {
          id: client.id,
          email: client.email,
          enable: client.enable,
          flow: client.flow || "",
          limitIp: client.limitIp || 0,
          subId: client.subId || "",
          comment: client.comment || "",
          reset: client.reset || 0,
          tgId: client.tgId || 0,
          totalGB: client.totalGB || 0,
          expiryTime: client.expiryTime || 0,
          expiry: expiryInfo,
          traffic: {
            up, down, totalUsed,
            upFormatted: formatBytes(up),
            downFormatted: formatBytes(down),
            totalUsedFormatted: formatBytes(totalUsed),
            totalLimit: stats?.total || 0,
            totalLimitFormatted: stats?.total === 0 ? "Unlimited" : formatBytes(stats?.total || 0),
            percentUsed: stats?.total > 0 ? Math.min(100, Number(((totalUsed / stats.total) * 100).toFixed(1))) : 0,
          },
          isOnline,
          statsEnabled: stats?.enable ?? true,
        };
      });

      return {
        id: inbound.id,
        remark: inbound.remark,
        protocol: inbound.protocol,
        port: inbound.port,
        enable: inbound.enable,
        up: inbound.up,
        down: inbound.down,
        total: inbound.total,
        upFormatted: formatBytes(inbound.up),
        downFormatted: formatBytes(inbound.down),
        totalFormatted: inbound.total === 0 ? "Unlimited" : formatBytes(inbound.total),
        clients: enrichedClients,
        clientCount: enrichedClients.length,
      };
    });

    return inbounds;
  },

  getEnrichedClientUsage: async (email: string) => {
    const response = await externalApi.getClientTraffics(email);

    if (!response.data.obj) {
      throw new Error("User not found");
    }

    if (response.data.success) {
      const { enable, up, down, total, expiryTime } = response.data.obj;
      const uploadGB = up / 1073741824;
      const downloadGB = down / 1073741824;
      const totalUsedGB = uploadGB + downloadGB;

      let formattedExpiry = null;
      let expiryRemaining = "N/A";
      let pendingDuration = null;
      let isExpired = false;
      const now = new Date();

      if (expiryTime < 0) {
        const durationMs = Math.abs(expiryTime);
        const mins = Math.floor(durationMs / (1000 * 60));
        const hours = Math.floor(durationMs / (1000 * 60 * 60));
        const days = Math.floor(durationMs / (1000 * 60 * 60 * 24));

        if (days >= 1) pendingDuration = `${days} day${days > 1 ? "s" : ""}`;
        else if (hours >= 1) pendingDuration = `${hours} hour${hours > 1 ? "s" : ""}`;
        else pendingDuration = `${mins} minute${mins > 1 ? "s" : ""}`;
      } else if (expiryTime > 0) {
        const expiryISO = new Date(expiryTime);
        formattedExpiry = expiryISO.toLocaleString("en-US", {
          month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "numeric", hour12: true,
        });

        if (expiryISO < now) {
          expiryRemaining = "Expired";
          isExpired = true;
        } else {
          const diffMs = expiryISO.getTime() - now.getTime();
          const mins = Math.floor(diffMs / (1000 * 60));
          const hours = Math.floor(diffMs / (1000 * 60 * 60));
          const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

          if (days >= 1) expiryRemaining = `${days} day${days > 1 ? "s" : ""}`;
          else if (hours >= 1) expiryRemaining = `${hours} hour${hours > 1 ? "s" : ""}`;
          else if (mins >= 1) expiryRemaining = `${mins} minute${mins > 1 ? "s" : ""}`;
          else expiryRemaining = "Less than a minute";
        }
      }

      let status = "Unknown";
      if (enable) {
        status = "Active";
      } else {
        if (isExpired) status = "Expired";
        else if (total !== 0 && totalUsedGB >= total / 1073741824) status = "Inactive - Quota Exceeded";
        else status = "Disabled";
      }

      let serverStatus = "Unavailable";
      try {
        const statusRes = await externalApi.getServerStatus();
        if (statusRes.data.success && statusRes.data.obj) {
          serverStatus = statusRes.data.obj.xray.state === "running" ? "Online" : "Offline";
        }
      } catch { }

      let onlineStatus = "Unavailable";
      try {
        const onlineRes = await externalApi.getOnlineUsers();
        if (onlineRes?.data?.success && Array.isArray(onlineRes.data.obj)) {
          onlineStatus = onlineRes.data.obj.includes(email) ? "Online" : "Offline";
        }
      } catch { }

      return {
        success: true,
        user: {
          name: email,
          status,
          isOnline: onlineStatus,
          quota: {
            upload: uploadGB.toFixed(2),
            download: downloadGB.toFixed(2),
            totalUsed: totalUsedGB.toFixed(2),
            total: total === 0 ? null : (total / 1073741824).toFixed(2),
          },
          expiry: { date: formattedExpiry, remaining: expiryRemaining, pending_duration: pendingDuration },
        },
        serverStatus,
      };
    }

    throw new Error("Failed to fetch client usage");
  }
};

// start session maintenance
const MAINTENANCE_INTERVAL_MS = Number(process.env.SESSION_DURATION || 24) * 60 * 60 * 1000;
setInterval(XuiService.maintainSession, MAINTENANCE_INTERVAL_MS);
