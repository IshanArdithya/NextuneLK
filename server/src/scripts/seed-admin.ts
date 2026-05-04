import { hashPassword } from "better-auth/crypto";
import prisma from "../config/prisma.js";
import { randomUUID } from "crypto";

async function seedAdmin() {
    try {
        const adminEmail = process.env.DEFAULT_ADMIN_EMAIL || "admin@nextune.com";
        const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD || "admin12345";

        // check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { email: adminEmail }
        });

        if (existingUser) {
            console.log("Admin user already exists. Skipping seed.");
            return;
        }

        console.log(`Creating fresh admin: ${adminEmail}...`);

        // create the user record
        const user = await prisma.user.create({
            data: {
                id: randomUUID().replace(/-/g, ""),
                name: "System Admin",
                email: adminEmail,
                emailVerified: true,
                needsPasswordChange: true
            }
        });

        // hash the password
        const hashedPassword = await hashPassword(adminPassword);

        // create the acc record
        await prisma.account.create({
            data: {
                userId: user.id,
                accountId: user.id,
                providerId: "credential",
                password: hashedPassword
            }
        });

        console.log("Admin user seeded successfully!");
        console.log("--------------------------------------------------");
        console.log(`Email: ${adminEmail}`);
        console.log(`Password: ${adminPassword}`);
        console.log("--------------------------------------------------");

    } catch (error) {
        console.error("Seeding failed:", error);
    } finally {
        process.exit();
    }
}

seedAdmin();
