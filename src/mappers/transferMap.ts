import { UpdateTransferDto } from "src/transfer/dto/update-transfer.dto";
import { Prisma, Transfer } from "@prisma/client";

export const mapToTransferUpdate = (data: UpdateTransferDto): Prisma.TransferUpdateInput => {
    const updateData: Prisma.TransferUpdateInput = {};

    if (data.transferAmount !== undefined) {
        updateData.amount = data.transferAmount;
    }
    if (data.transferDebitAccount !== undefined) {
        updateData.debit_account = data.transferDebitAccount;
    }
    if (data.transferCreditAccount !== undefined) {
        updateData.credit_account = data.transferCreditAccount;
    }
    if (data.transferCompanyId !== undefined) {
        updateData.company = { connect: { id: data.transferCompanyId } };
    }
    if (data.createdAt !== undefined) {
        updateData.createdAt = new Date(data.createdAt);
    }

    return updateData;
}

export const mapToTransferDto = (transfer: Transfer) => {
    return {
        transferAmount: transfer.amount,
        transferCompanyId: transfer.company_id,
        transferDebitAccount: transfer.debit_account,
        transferCreditAccount: transfer.credit_account,
    };
}