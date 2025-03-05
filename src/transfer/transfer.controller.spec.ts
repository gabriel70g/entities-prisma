import { Test, TestingModule } from '@nestjs/testing';
import { TransferController } from './transfer.controller';
import { TransferService } from './transfer.service';
import { PrismaModule } from '../prisma/prisma.module';
import { CompanyService } from '../company/company.service';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { UpdateTransferDto } from './dto/update-transfer.dto';
import { Transfer } from './entities/transfer.entity';


describe('TransferController', () => {
  let controller: TransferController;
  let service: TransferService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      controllers: [TransferController],
      providers: [TransferService, CompanyService],
    }).compile();

    controller = module.get<TransferController>(TransferController);
    service = module.get<TransferService>(TransferService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a transfer', async () => {
      const createTransferDto: CreateTransferDto = {
        transferAmount: 100,
        transferCompanyId: 1,
        transferDebitAccount: 'debitAccount',
        transferCreditAccount: 'creditAccount',
      };
      const result = {
        id: 1,
        amount: createTransferDto.transferAmount,
        company_id: createTransferDto.transferCompanyId,
        debit_account: createTransferDto.transferDebitAccount,
        credit_account: createTransferDto.transferCreditAccount,
        createdAt: new Date()
      };
      jest.spyOn(service, 'create').mockImplementation(async () => result);

      expect(await controller.create(createTransferDto)).toBe(result);
    });
  });

  describe('findAll', () => {
    it('should return an array of transfers', async () => {
      const result: Transfer[] = [{ id: 1, amount: 100, company_id: 1, debit_account: 'debitAccount', credit_account: 'creditAccount', createdAt: new Date() }];
      jest.spyOn(service, 'findAll').mockImplementation(async () => result);

      expect(await controller.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a single transfer', async () => {
      const result: Transfer = { id: 1, amount: 100, company_id: 1, debit_account: 'debitAccount', credit_account: 'creditAccount', createdAt: new Date() };
      jest.spyOn(service, 'findOne').mockImplementation(async () => result);

      expect(await controller.findOne('1')).toBe(result);
    });
  });

  describe('update', () => {
    it('should update a transfer', async () => {
      const newdate = new Date();
      const updateTransferDto: UpdateTransferDto = {
        transferAmount: 200,
        transferCompanyId: 1,
        transferDebitAccount: 'debitAccount',
        transferCreditAccount: 'creditAccount',
      };
      const result: Transfer = { 
        id: 1, 
        amount: updateTransferDto.transferAmount!,
        company_id: updateTransferDto.transferCompanyId!,
        debit_account: updateTransferDto.transferDebitAccount!,
        credit_account: updateTransferDto.transferCreditAccount!,
        createdAt:newdate
      };
      jest.spyOn(service, 'update').mockImplementation(async () => result);

      expect(await controller.update('1', updateTransferDto)).toBeTruthy();
    });
  });

  describe('remove', () => {
    it('should delete a transfer', async () => {
      const result: Transfer = { id: 1, amount: 100, company_id: 1, debit_account: 'debitAccount', credit_account: 'creditAccount', createdAt: new Date()};
      jest.spyOn(service, 'delete').mockImplementation(async () => result);

      expect(await controller.remove('1')).toBe(result);
    });
  });
});
