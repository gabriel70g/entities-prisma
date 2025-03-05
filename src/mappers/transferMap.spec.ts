import { mapToTransferUpdate, mapToTransferDto } from './transferMap';
import { UpdateTransferDto } from 'src/transfer/dto/update-transfer.dto';
import { Transfer } from 'src/transfer/entities/transfer.entity';

describe('Transfer Mappers', () => {
  it('should map UpdateTransferDto to Transfer entity', () => {
    const transferDto: UpdateTransferDto = {
      transferAmount: 1000,
      transferCompanyId: 123,
      transferDebitAccount: 'debit123',
      transferCreditAccount: 'credit123',
      createdAt: new Date("2025-01-01"),
    };

    const result = mapToTransferUpdate(transferDto);

    expect(result).toEqual({
      amount: 1000,
      company: {
        connect: {
          id: 123,
        },
      },
      debit_account: 'debit123',
      credit_account: 'credit123',
      createdAt: new Date("2025-01-01"),
    });
  });

  it('should map Transfer entity to UpdateTransferDto', () => {
    const transfer: Transfer = {
      id: 1,
      createdAt: new Date(),
      amount: 1000,
      company_id: 123,
      debit_account: 'debit123',
      credit_account: 'credit123',
    };

    const result = mapToTransferDto(transfer);

    expect(result).toEqual({
      transferAmount: 1000,
      transferCompanyId: 123,
      transferDebitAccount: 'debit123',
      transferCreditAccount: 'credit123',
    });
  });
});