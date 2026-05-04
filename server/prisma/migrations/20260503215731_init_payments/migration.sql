-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PAID', 'UNPAID', 'REFUNDED');

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "client_email" TEXT NOT NULL,
    "inbound_id" INTEGER NOT NULL,
    "quota_gb" DOUBLE PRECISION,
    "amount_paid" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'LKR',
    "payment_date" TIMESTAMP(3),
    "status" "PaymentStatus" NOT NULL DEFAULT 'UNPAID',
    "cycle_start" TIMESTAMP(3),
    "cycle_end" TIMESTAMP(3),
    "is_new_client" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "payments_client_email_idx" ON "payments"("client_email");

-- CreateIndex
CREATE INDEX "payments_inbound_id_idx" ON "payments"("inbound_id");

-- CreateIndex
CREATE INDEX "payments_status_idx" ON "payments"("status");
