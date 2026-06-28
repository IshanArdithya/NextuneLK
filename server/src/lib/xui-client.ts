import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export function parseJsonField<T = Record<string, unknown>>(
  value: unknown,
  fallback: T = {} as T
): T {
  if (value == null) return fallback;
  if (typeof value === "object") return value as T;
  if (typeof value === "string") {
    try {
      return JSON.parse(value) as T;
    } catch {
      return fallback;
    }
  }
  return fallback;
}

export class ExternalApi {
  api: any;

  constructor() {
    this.validateEnvVars();

    this.api = axios.create({
      baseURL: process.env.XUI_WEB_URL,
      headers: {
        Authorization: `Bearer ${process.env.XUI_API_TOKEN}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
  }

  validateEnvVars() {
    const requiredEnvVars = ["XUI_WEB_URL", "XUI_API_TOKEN"];
    const missingVars = requiredEnvVars.filter(
      (envVar) => !process.env[envVar]
    );

    if (missingVars.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missingVars.join(", ")}`
      );
    }
  }

  private encodeEmail(email: string) {
    return encodeURIComponent(email);
  }

  private assertJsonResponse(response: any, context: string) {
    if (
      typeof response.data === "string" &&
      response.data.includes("<!DOCTYPE html>")
    ) {
      throw {
        response: {
          data: {
            success: false,
            msg: `${context}: Panel returned HTML instead of JSON — check XUI_API_TOKEN`,
            obj: null,
          },
        },
      };
    }
    return response;
  }

  private wrapError(error: any) {
    if (error.response?.data) {
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

  async getClientTraffic(email: string) {
    try {
      const response = await this.api.get(
        `/panel/api/clients/traffic/${this.encodeEmail(email)}`
      );
      return this.assertJsonResponse(response, "Error Fetching Usage");
    } catch (error: any) {
      this.wrapError(error);
    }
  }

  async getClient(email: string) {
    try {
      const response = await this.api.get(
        `/panel/api/clients/get/${this.encodeEmail(email)}`
      );
      return this.assertJsonResponse(response, "Error Fetching Client");
    } catch (error: any) {
      this.wrapError(error);
    }
  }

  async getClientsList() {
    try {
      const response = await this.api.get(`/panel/api/clients/list`);
      return this.assertJsonResponse(response, "Error Fetching Clients");
    } catch (error: any) {
      this.wrapError(error);
    }
  }

  async findClientIdByEmail(inboundId: number, email: string) {
    try {
      const response = await this.getInbound(inboundId);
      if (!response.data.success || !response.data.obj?.settings) {
        return null;
      }

      const settings = parseJsonField<{ clients?: any[] }>(
        response.data.obj.settings
      );
      const client = (settings.clients || []).find((c: any) => c.email === email);
      return client?.id || client?.password || null;
    } catch (error) {
      console.error("Error finding client ID:", error);
      return null;
    }
  }

  async getServerStatus() {
    try {
      const response = await this.api.get(`/panel/api/server/status`);
      return this.assertJsonResponse(response, "Error Fetching Server Status");
    } catch (error: any) {
      this.wrapError(error);
    }
  }

  async getOnlineUsers() {
    try {
      const response = await this.api.post(`/panel/api/clients/onlines`);
      return this.assertJsonResponse(response, "Error Fetching Online Users");
    } catch (error: any) {
      this.wrapError(error);
    }
  }

  getSessionStatus() {
    return {
      isLoggedIn: true,
      lastLoginTime: null,
      sessionActive: true,
      remainingTime: null,
      authMode: "bearer-token",
    };
  }

  async getInbounds() {
    try {
      const response = await this.api.get(`/panel/api/inbounds/list`);
      return this.assertJsonResponse(response, "Error Fetching Inbounds");
    } catch (error: any) {
      this.wrapError(error);
    }
  }

  async getInbound(id: number) {
    try {
      const response = await this.api.get(`/panel/api/inbounds/get/${id}`);
      return this.assertJsonResponse(response, "Error Fetching Inbound");
    } catch (error: any) {
      this.wrapError(error);
    }
  }

  async addClient(payload: {
    client: Record<string, unknown>;
    inboundIds: number[];
  }) {
    try {
      const response = await this.api.post(`/panel/api/clients/add`, payload);
      return this.assertJsonResponse(response, "Error Adding Client");
    } catch (error: any) {
      this.wrapError(error);
    }
  }

  async updateClient(email: string, client: Record<string, unknown>) {
    try {
      const response = await this.api.post(
        `/panel/api/clients/update/${this.encodeEmail(email)}`,
        client
      );
      return this.assertJsonResponse(response, "Error Updating Client");
    } catch (error: any) {
      this.wrapError(error);
    }
  }

  async deleteClient(email: string) {
    try {
      const response = await this.api.post(
        `/panel/api/clients/del/${this.encodeEmail(email)}`
      );
      return this.assertJsonResponse(response, "Error Deleting Client");
    } catch (error: any) {
      this.wrapError(error);
    }
  }

  async resetClientTraffic(email: string) {
    try {
      const response = await this.api.post(
        `/panel/api/clients/resetTraffic/${this.encodeEmail(email)}`
      );
      return this.assertJsonResponse(response, "Error Resetting Traffic");
    } catch (error: any) {
      this.wrapError(error);
    }
  }

  async getClientLinks(email: string) {
    try {
      const response = await this.api.get(
        `/panel/api/clients/links/${this.encodeEmail(email)}`
      );
      return this.assertJsonResponse(response, "Error Fetching Client Links");
    } catch (error: any) {
      this.wrapError(error);
    }
  }
}
