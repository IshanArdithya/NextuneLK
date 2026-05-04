-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "preset_id" TEXT;

-- CreateTable
CREATE TABLE "presets" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "quota_gb" DOUBLE PRECISION NOT NULL,
    "days" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'LKR',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "presets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "payments_preset_id_idx" ON "payments"("preset_id");

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_preset_id_fkey" FOREIGN KEY ("preset_id") REFERENCES "presets"("id") ON DELETE SET NULL ON UPDATE CASCADE;
