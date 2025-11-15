import dotenv from "dotenv";
import { ExternalApi } from "../models/externalApi.model.js";

dotenv.config();
const externalApi = new ExternalApi();

const maintainSession = async () => {
  try {
    console.log("Running session maintenance...");
    await externalApi.login(true);
  } catch (error) {
    console.error(
      "Session maintenance error:",
      error.response?.data?.msg || error.message
    );
  }
};

// start session maintenance interval
const MAINTENANCE_INTERVAL_MS = process.env.SESSION_DURATION * 60 * 60 * 1000;
const maintenanceInterval = setInterval(
  maintainSession,
  MAINTENANCE_INTERVAL_MS
);

// cleanup on process exit
process.on("SIGINT", () => {
  clearInterval(maintenanceInterval);
  process.exit();
});

export const getSessionStatus = async (req, res) => {
  try {
    res.json(externalApi.getSessionStatus());
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: error.message,
      obj: null,
    });
  }
};

export const getClientUsage = async (req, res) => {
  try {
    const { email } = req.params;
    const response = await externalApi.getClientTraffics(email);

    if (!response.data.obj) {
      return res.status(404).json({
        success: false,
        msg: response.data.msg || "User not found",
        obj: null,
      });
    }

    if (response.data.success) {
      const { email, enable, up, down, total, expiryTime } = response.data.obj;

      const uploadGB = up / 1073741824;
      const downloadGB = down / 1073741824;
      const totalUsedGB = uploadGB + downloadGB;

      // expiry conversion
      let expiryISO = expiryTime === 0 ? null : new Date(expiryTime);
      let formattedExpiry = expiryISO
        ? expiryISO.toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          })
        : null;

      // calc expiry remaining
      const now = new Date();
      let expiryRemaining = "N/A";
      let isExpired = false;

      if (expiryISO) {
        if (expiryISO < now) {
          expiryRemaining = "Expired";
          isExpired = true;
        } else {
          const diffMs = expiryISO - now;

          const mins = Math.floor(diffMs / (1000 * 60));
          const hours = Math.floor(diffMs / (1000 * 60 * 60));
          const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

          if (days >= 1) {
            expiryRemaining = `${days} day${days > 1 ? "s" : ""}`;
          } else if (hours >= 1) {
            expiryRemaining = `${hours} hour${hours > 1 ? "s" : ""}`;
          } else if (mins >= 1) {
            expiryRemaining = `${mins} minute${mins > 1 ? "s" : ""}`;
          } else {
            expiryRemaining = "Less than a minute";
          }
        }
      }

      // determine status
      let status = "Unknown";

      if (enable) {
        status = "Active";
      } else {
        if (isExpired) {
          status = "Expired";
        } else if (total !== 0 && totalUsedGB >= total / 1073741824) {
          status = "Inactive - Quota Exceeded";
        } else {
          status = "Disabled";
        }
      }

      // get server status
      let serverStatus = null;

      try {
        const statusRes = await externalApi.getServerStatus();

        if (!statusRes.data.obj) {
          serverStatus = "Unavailable";
        } else if (statusRes.data.success) {
          const state = statusRes.data.obj.xray.state;
          serverStatus = state === "running" ? "Online" : "Offline";
        } else {
          serverStatus = "Unavailable";
        }
      } catch (error) {
        console.warn(
          "Server status failed:",
          error?.response?.data?.msg || error.message || "Unknown error"
        );
        serverStatus = "Unavailable";
      }

      // get user online status
      let onlineStatus = "Unavailable";

      try {
        const onlineRes = await externalApi.getOnlineUsers();

        if (onlineRes?.data?.success && Array.isArray(onlineRes.data.obj)) {
          const onlineUsers = onlineRes.data.obj;

          if (onlineUsers.includes(email)) {
            onlineStatus = "Online";
          } else {
            onlineStatus = "Offline";
          }
        } else {
          onlineStatus = "Unavailable";
        }
      } catch (error) {
        console.warn(
          "Online check failed:",
          error?.response?.data?.msg || error.message || "Unknown error"
        );

        onlineStatus = "Unavailable";
      }

      const processedData = {
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
          expiry: {
            date: expiryTime === 0 ? null : formattedExpiry,
            remaining: expiryTime === 0 ? null : expiryRemaining,
          },
        },
        serverStatus,
        // raw: response.data.obj,
      };

      return res.json(processedData);
    }

    return res.status(404).json({
      success: false,
      msg: response.data.msg || "User not found",
      obj: null,
    });
  } catch (error) {
    console.error("API Error:", error.response?.data?.msg || error.message);

    const statusCode = error.response?.status || 500;
    const errorData = error.response?.data || {
      success: false,
      msg: "Server Error",
      obj: null,
    };

    res.status(statusCode).json(errorData);
  }
};
