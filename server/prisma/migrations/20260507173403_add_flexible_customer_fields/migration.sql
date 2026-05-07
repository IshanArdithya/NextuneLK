-- AlterTable
ALTER TABLE "customers" ADD COLUMN     "name" TEXT,
ALTER COLUMN "email" DROP NOT NULL;

-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "customer_name" TEXT;
