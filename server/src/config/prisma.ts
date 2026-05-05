import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

// Standard initialization. 
// This will work perfectly once the prisma.config.ts is gone from the build.
const prisma = new PrismaClient();

export default prisma;
