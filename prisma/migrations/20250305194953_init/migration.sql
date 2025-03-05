-- AlterTable
ALTER TABLE "Transfer" ALTER COLUMN "debit_account" DROP NOT NULL,
ALTER COLUMN "credit_account" DROP NOT NULL;
