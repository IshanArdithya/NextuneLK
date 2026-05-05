/*
  Warnings:

  - You are about to drop the column `client_email` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `client_id` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the `clients` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "CustomerStatus" AS ENUM ('ACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "ServiceStatus" AS ENUM ('ACTIVE', 'DISABLED');

-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_client_id_fkey";

-- DropIndex
DROP INDEX "payments_client_email_idx";

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "client_email",
DROP COLUMN "client_id",
ADD COLUMN     "customer_email" TEXT,
ADD COLUMN     "customer_id" TEXT;

-- DropTable
DROP TABLE "clients";

-- DropEnum
DROP TYPE "ClientStatus";

-- CreateTable
CREATE TABLE "customers" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "notes" TEXT,
    "status" "CustomerStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "services" (
    "id" TEXT NOT NULL,
    "xui_id" TEXT NOT NULL,
    "xui_email" TEXT NOT NULL,
    "inbound_id" INTEGER NOT NULL,
    "customer_id" TEXT,
    "status" "ServiceStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "customers_email_key" ON "customers"("email");

-- CreateIndex
CREATE INDEX "customers_status_idx" ON "customers"("status");

-- CreateIndex
CREATE UNIQUE INDEX "services_xui_id_key" ON "services"("xui_id");

-- CreateIndex
CREATE INDEX "services_customer_id_idx" ON "services"("customer_id");

-- CreateIndex
CREATE INDEX "services_inbound_id_idx" ON "services"("inbound_id");

-- CreateIndex
CREATE INDEX "services_status_idx" ON "services"("status");

-- CreateIndex
CREATE INDEX "payments_customer_email_idx" ON "payments"("customer_email");

-- CreateIndex
CREATE INDEX "payments_customer_id_idx" ON "payments"("customer_id");

-- AddForeignKey
ALTER TABLE "services" ADD CONSTRAINT "services_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
