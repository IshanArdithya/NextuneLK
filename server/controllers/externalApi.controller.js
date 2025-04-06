import { ExternalApi } from "../models/externalApi.model.js";

const externalApi = new ExternalApi();

// session maintenance
const maintainSession = async () => {
  try {
    if (externalApi.isLoggedIn) {
      const now = Date.now();
      if (now - externalApi.lastLoginTime > SESSION_TIMEOUT * 0.8) {
        await externalApi.login(true);
      }
    } else {
      await externalApi.login();
    }
  } catch (error) {
    console.error("Session maintenance error:", error.message);
  }
};

// start session maintenance interval (every 5 minutes)
setInterval(maintainSession, 5 * 60 * 1000);

export const getSessionStatus = async (req, res) => {
  try {
    res.json(externalApi.getSessionStatus());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getClientUsage = async (req, res) => {
  try {
    const { email } = req.params;
    const response = await externalApi.getClientTraffics(email);

    if (response.data.success) {
      const { email, enable, up, down, total, expiryTime } = response.data.obj;
      const processedData = {
        name: email,
        status: enable,
        upload: (up / 1073741824).toFixed(2) + " GB",
        download: (down / 1073741824).toFixed(2) + " GB",
        total: total === 0 ? 0 : (total / 1073741824).toFixed(2) + " GB",
        expiry: expiryTime === 0 ? 0 : new Date(expiryTime).toLocaleString(),
        raw: response.data.obj,
      };
      return res.json(processedData);
    }
    return res
      .status(404)
      .json({ error: response.data.msg || "User not found" });
  } catch (error) {
    console.error("API Error:", error.message);

    let statusCode = 500;
    let errorMessage = "Server Error";

    if (error.message.includes("authentication")) {
      statusCode = 401;
      errorMessage = "Authentication failed";
    } else if (error.response) {
      statusCode = error.response.status || 500;
      errorMessage = error.response.data?.msg || error.message;
    }

    res.status(statusCode).json({
      error: errorMessage,
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
