//necesito hacer un mapper desde el dto de la transferencia a la entidad de la transferencia

import { UpdateTransferDto } from "src/transfer/dto/update-transfer.dto";
import { Transfer } from "src/transfer/entities/transfer.entity";

// src/mappers/mapToTransfer.ts
export const mapToTransferUpadate = (transferDto: UpdateTransferDto) => {
    return {
        amount: transferDto.transferAmount,
        company_id: transferDto.transferCompanyId,
        debit_account: transferDto.transferDebitAccount,   
        credit_account: transferDto.transferCreditAccount,
    };
}

// necesito hacer un mapper desde la entidad de la transferencia a la dto de la transferencia
// src/mappers/mapToTransferDto.ts
export const mapToTransferDto = (transfer:Transfer) => {
    return {
        transferAmount: transfer.amount,
        transferCompanyId: transfer.company_id,
        transferDebitAccount: transfer.debit_account,
        transferCreditAccount: transfer.credit_account,
    };
}
