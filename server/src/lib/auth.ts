import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "../config/prisma.js";

export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL,
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    trustedOrigins: [process.env.FRONTEND_URL || "http://localhost:3000"],
    emailAndPassword: {
        enabled: true,
        autoSignIn: true,
        disableSignUp: true,
    },
    // custom session data to include first-login flag
    user: {
        changeEmail: {
            enabled: true,
        },
        additionalFields: {
            needsPasswordChange: {
                type: "boolean",
                required: false,
                defaultValue: true,
            }
        }
    },
    advanced: {
        useSecureCookies: true,
    },
    cookies: {
        sessionToken: {
            attributes: {
                sameSite: "none",
                secure: true,
                path: "/",
            }
        }
    }
});
