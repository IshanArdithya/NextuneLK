import { hashPassword } from "better-auth/crypto";
import prisma from "../config/prisma.js";
import { AppError } from "../utils/AppError.js";

export const AuthService = {
    // finalize the initial admin setup by setting credentials
    finalizeSetup: async (userId: string, newEmail: string, newPassword: string) => {
        // security check
        const user = await prisma.user.findUnique({ where: { id: userId } });
        
        if (!user || !user.needsPasswordChange) {
            throw new AppError("Setup already completed or user not found.", 403, "SETUP_ALREADY_COMPLETED");
        }

        // hash and update account
        const hashedPassword = await hashPassword(newPassword);
        
        await prisma.account.updateMany({
            where: { userId: userId, providerId: "credential" },
            data: { password: hashedPassword }
        });

        // update user email and flag
        await prisma.user.update({
            where: { id: userId },
            data: { 
                email: newEmail,
                needsPasswordChange: false 
            }
        });

        return { success: true };
    }
};
