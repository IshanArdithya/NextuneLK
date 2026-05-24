import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export class ExternalApi {
  api: any;

  constructor() {
    this.validateEnvVars();

    this.api = axios.create({
      baseURL: process.env.XUI_WEB_URL,
      headers: {
        Authorization: `Bearer ${process.env.XUI_API_TOKEN}`,
        Accept: "application/json",
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

  async getClientTraffics(email: string) {
    try {
      const response = await this.api.get(
        `/panel/api/clients/traffic/${email}`
      );
      return this.assertJsonResponse(response, "Error Fetching Usage");
    } catch (error: any) {
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

  async getClientByEmail(email: string) {
    try {
      const response = await this.api.get(
        `/panel/api/clients/get/${email}`
      );
      return this.assertJsonResponse(response, "Error Fetching Client");
    } catch (error: any) {
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

  // helper to find a client's uuid/id by their email
  async findClientIdByEmail(inboundId: number, email: string) {
    try {
      const response = await this.getInbound(inboundId);
      if (!response.data.success || !response.data.obj) {
        return null;
      }

      const settings = typeof response.data.obj.settings === "string"
        ? JSON.parse(response.data.obj.settings)
        : response.data.obj.settings || {};
      const clients = settings.clients || [];

      const client = clients.find((c: any) => c.email === email);
      return client ? client.id : null;
    } catch (error) {
      console.error("Error finding client ID:", error);
      return null;
    }
  }

  // server endpoints

  async getServerStatus() {
    try {
      const response = await this.api.get(`/panel/api/server/status`);
      return this.assertJsonResponse(response, "Error Fetching Server Status");
    } catch (error: any) {
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

  async getOnlineUsers() {
    try {
      const response = await this.api.post(`/panel/api/clients/onlines`);
      return this.assertJsonResponse(response, "Error Fetching Online Users");
    } catch (error: any) {
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
    return {
      isLoggedIn: true,
      lastLoginTime: null,
      sessionActive: true,
      remainingTime: null,
      authMode: "bearer-token",
    };
  }

  // inbound endpoints

  // fetch the full list of inbounds with clients
  async getInbounds() {
    try {
      const response = await this.api.get(`/panel/api/inbounds/list`);
      return this.assertJsonResponse(response, "Error Fetching Inbounds");
    } catch (error: any) {
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

  // fetch a single inbound by ID
  async getInbound(id: number) {
    try {
      const response = await this.api.get(`/panel/api/inbounds/get/${id}`);
      return this.assertJsonResponse(response, "Error Fetching Inbound");
    } catch (error: any) {
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

  // client crud

  async addClient(data: { client: any; inboundIds: number[] }) {
    try {
      const response = await this.api.post(
        `/panel/api/clients/add`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return this.assertJsonResponse(response, "Error Adding Client");
    } catch (error: any) {
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

  async updateClient(email: string, clientData: any) {
    try {
      const response = await this.api.post(
        `/panel/api/clients/update/${email}`,
        clientData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return this.assertJsonResponse(response, "Error Updating Client");
    } catch (error: any) {
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

  async deleteClient(email: string) {
    try {
      const response = await this.api.post(
        `/panel/api/clients/del/${email}`
      );
      return this.assertJsonResponse(response, "Error Deleting Client");
    } catch (error: any) {
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

  async resetClientTraffic(email: string) {
    try {
      const response = await this.api.post(
        `/panel/api/clients/resetTraffic/${email}`
      );
      return this.assertJsonResponse(response, "Error Resetting Traffic");
    } catch (error: any) {
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
}
