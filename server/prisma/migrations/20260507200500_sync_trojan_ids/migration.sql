-- DropIndex
DROP INDEX IF EXISTS "services_xui_id_key";

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "services_inbound_id_xui_id_key" ON "services"("inbound_id", "xui_id");
