-- CreateTable
CREATE TABLE "Company" (
    "id" SERIAL NOT NULL,
    "cuit" TEXT NOT NULL,
    "company_name" TEXT NOT NULL,
    "accession_date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transfer" (
    "id" SERIAL NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "company_id" INTEGER NOT NULL,
    "debit_account" TEXT NOT NULL,
    "credit_account" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transfer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Company_cuit_key" ON "Company"("cuit");

-- AddForeignKey
ALTER TABLE "Transfer" ADD CONSTRAINT "Transfer_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
