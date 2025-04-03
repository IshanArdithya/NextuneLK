import axios from "axios";
import dotenv from "dotenv";
import { wrapper } from "axios-cookiejar-support";
import { CookieJar } from "tough-cookie";

dotenv.config();

const SESSION_TIMEOUT = 24 * 60 * 1000; // 24h session timeout

export class ExternalApi {
  constructor() {
    if (!process.env.XUI_USERNAME || !process.env.XUI_PASSWORD) {
      throw new Error(
        "XUI credentials not configured in environment variables"
      );
    }

    this.cookieJar = new CookieJar();
    this.api = wrapper(
      axios.create({
        baseURL: "https://iamdiamondone.online:2002/heoughten",
        jar: this.cookieJar,
        withCredentials: true,
      })
    );
    this.lastLoginTime = 0;
    this.isLoggedIn = false;
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
        throw new Error("Login failed: " + (res.data.msg || "Unknown error"));
      }

      this.isLoggedIn = true;
      this.lastLoginTime = now;
      return true;
    } catch (error) {
      this.isLoggedIn = false;
      throw error;
    }
  }

  async getClientTraffics(email) {
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
        await this.login(true); // force re-login
        return this.api.get(`/panel/api/inbounds/getClientTraffics/${email}`);
      }

      return response;
    } catch (error) {
      throw error;
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
