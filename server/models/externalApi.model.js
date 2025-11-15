import axios from "axios";
import dotenv from "dotenv";
import { wrapper } from "axios-cookiejar-support";
import { CookieJar } from "tough-cookie";

dotenv.config();

const SESSION_TIMEOUT = process.env.SESSION_DURATION * 60 * 60 * 1000; // 24h session timeout
const MAX_RETRY_ATTEMPTS = 3;

export class ExternalApi {
  constructor() {
    this.validateEnvVars();

    this.cookieJar = new CookieJar();
    this.api = wrapper(
      axios.create({
        baseURL: process.env.XUI_WEB_URL,
        jar: this.cookieJar,
        withCredentials: true,
      })
    );
    this.lastLoginTime = 0;
    this.isLoggedIn = false;
    this.loginAttempts = 0;
  }

  validateEnvVars() {
    const requiredEnvVars = ["XUI_WEB_URL", "XUI_USERNAME", "XUI_PASSWORD"];
    const missingVars = requiredEnvVars.filter(
      (envVar) => !process.env[envVar]
    );

    if (missingVars.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missingVars.join(", ")}`
      );
    }
  }

  async login(force = false) {
    try {
      const now = Date.now();
      if (
        !force &&
        this.isLoggedIn &&
        now - this.lastLoginTime < SESSION_TIMEOUT
      ) {
        return true;
      }

      const res = await this.api.post(
        "/login",
        `username=${process.env.XUI_USERNAME}&password=${process.env.XUI_PASSWORD}`,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      if (!res.data.success) {
        throw {
          response: {
            data: {
              success: false,
              msg: res.data.msg || "Login failed",
              obj: null,
            },
          },
        };
      }

      this.isLoggedIn = true;
      this.lastLoginTime = now;
      this.loginAttempts = 0;
      return true;
    } catch (error) {
      this.isLoggedIn = false;
      this.loginAttempts++;

      if (this.loginAttempts >= MAX_RETRY_ATTEMPTS) {
        throw {
          response: {
            data: {
              success: false,
              msg: "Maximum login attempts reached",
              obj: null,
            },
          },
        };
      }

      throw error;
    }
  }

  async getClientTraffics(email, attempt = 1) {
    try {
      if (!this.isLoggedIn) {
        await this.login();
      }

      const response = await this.api.get(
        `/panel/api/inbounds/getClientTraffics/${email}`
      );

      if (
        typeof response.data === "string" &&
        response.data.includes("<!DOCTYPE html>")
      ) {
        if (attempt >= MAX_RETRY_ATTEMPTS) {
          throw {
            response: {
              data: {
                success: false,
                msg: "Error Fetching Usage (Code - 001)",
                obj: null,
              },
            },
          };
        }

        await this.login(true);
        return this.getClientTraffics(email, attempt + 1);
      }

      return response;
    } catch (error) {
      if (error.response && error.response.data) {
        throw error;
      }

      throw {
        response: {
          data: {
            success: false,
            msg: error.message || "Unknown error",
            obj: null,
          },
        },
      };
    }
  }

  async getServerStatus(attempt = 1) {
    try {
      if (!this.isLoggedIn) {
        await this.login();
      }

      const response = await this.api.post(`/server/status`);

      if (
        typeof response.data === "string" &&
        response.data.includes("<!DOCTYPE html>")
      ) {
        if (attempt >= MAX_RETRY_ATTEMPTS) {
          throw {
            response: {
              data: {
                success: false,
                msg: "Error Fetching Server Status (Code - 001)",
                obj: null,
              },
            },
          };
        }

        await this.login(true);
        return this.getServerStatus(attempt + 1);
      }
      return response;
    } catch (error) {
      if (error.response && error.response.data) {
        throw error;
      }
      throw {
        response: {
          data: {
            success: false,
            msg: error.message || "Unknown error",
            obj: null,
          },
        },
      };
    }
  }

  async getOnlineUsers(attempt = 1) {
    try {
      if (!this.isLoggedIn) {
        await this.login();
      }

      const response = await this.api.post(`/panel/api/inbounds/onlines`);

      if (
        typeof response.data === "string" &&
        response.data.includes("<!DOCTYPE html>")
      ) {
        if (attempt >= MAX_RETRY_ATTEMPTS) {
          throw {
            response: {
              data: {
                success: false,
                msg: "Error Fetching Online Users (Code - 001)",
                obj: null,
              },
            },
          };
        }
        await this.login(true);
        return this.getOnlineUsers(attempt + 1);
      }
      return response;
    } catch (error) {
      if (error.response && error.response.data) {
        throw error;
      }
      throw {
        response: {
          data: {
            success: false,
            msg: error.message || "Unknown error",
            obj: null,
          },
        },
      };
    }
  }

  getSessionStatus() {
    const now = Date.now();
    const sessionActive =
      this.isLoggedIn && now - this.lastLoginTime < SESSION_TIMEOUT;
    return {
      isLoggedIn: this.isLoggedIn,
      lastLoginTime: new Date(this.lastLoginTime).toISOString(),
      sessionActive,
      remainingTime: sessionActive
        ? SESSION_TIMEOUT - (now - this.lastLoginTime)
        : 0,
    };
  }
}
