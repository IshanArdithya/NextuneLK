import { ClientService } from "../services/client.service.js";
import prisma from "../config/prisma.js";

async function main() {
  console.log("Starting synchronization...");
  await ClientService.syncPanelToDb();
  console.log("Synchronization complete.");
}

main()
  .catch((e) => {
    console.error("Sync failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
