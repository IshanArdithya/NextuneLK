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
      const processedData = {
        name: email,
        status: enable,
        upload: (up / 1073741824).toFixed(2),
        download: (down / 1073741824).toFixed(2),
        total: total === 0 ? 0 : (total / 1073741824).toFixed(2),
        expiry: expiryTime === 0 ? 0 : new Date(expiryTime).toISOString(),
        raw: response.data.obj,
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

// export const logout = async (req, res) => {
//   try {
//     const result = await externalApi.logout();
//     res.json({
//       success: true,
//       msg: "Logged out successfully",
//       obj: result,
//     });
//   } catch (error) {
//     console.error("Logout error:", error.response?.data?.msg || error.message);
//     res.status(500).json({
//       success: false,
//       msg: error.response?.data?.msg || "Logout failed",
//       obj: null,
//     });
//   }
// };
