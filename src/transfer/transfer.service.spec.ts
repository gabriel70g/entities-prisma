import { Test, TestingModule } from '@nestjs/testing';
import { TransferService } from './transfer.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { UpdateTransferDto } from './dto/update-transfer.dto';

describe('TransferService', () => {
  let service: TransferService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransferService,
        {
          provide: PrismaService,
          useValue: {
            transfer: {
              create: jest.fn(),
              findFirst: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
              findMany: jest.fn(),
            },
            company: {
              findMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<TransferService>(TransferService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
  
    it('should create a transfer', async () => {
      const transferData = { company: { connect: { id: 1 } } } as Prisma.TransferCreateInput;
      const transfer = { id: 1, amount: 100, company_id: 1, debit_account: 'debit', credit_account: 'credit', createdAt: new Date() };
      (prismaService.company.findMany as jest.Mock).mockResolvedValue([{}]);
      (prismaService.transfer.create as jest.Mock).mockResolvedValue(transfer);
  
      const result = await service.create(transferData);
  
      expect(result).toEqual({
        id: transfer.id,
        amount: transfer.amount,
        company_id: transfer.company_id,
        debit_account: transfer.debit_account,
        credit_account: transfer.credit_account,
        createdAt: transfer.createdAt,
      });
    });
  });

  describe('updateTransfer', () => {
    it('should throw NotFoundException if transfer is not found', async () => {
      (prismaService.transfer.findFirst as jest.Mock).mockResolvedValue(null);
      await expect(service.updateTransfer(1, {} as UpdateTransferDto)).rejects.toThrow(NotFoundException);
    });

    it('should update a transfer', async () => {
      const transfer = { id: 1, amount: 100, company_id: 1, debit_account: 'debit', credit_account: 'credit', createdAt: new Date() };
      const updateData = { amount: 200 } as unknown as UpdateTransferDto;
      (prismaService.transfer.findFirst as jest.Mock).mockResolvedValue(transfer);
      (prismaService.transfer.update as jest.Mock).mockResolvedValue({ ...transfer, ...updateData });

      const result = await service.updateTransfer(1, updateData);

      expect(result).toEqual({ ...transfer, ...updateData });
    });
  });

  describe('delete', () => {
    it('should throw NotFoundException if transfer is not found', async () => {
      (prismaService.transfer.findFirst as jest.Mock).mockResolvedValue(null);
      await expect(service.delete({ id: 1 })).rejects.toThrow(NotFoundException);
    });

    it('should delete a transfer', async () => {
      const transfer = { id: 1, amount: 100, company_id: 1, debit_account: 'debit', credit_account: 'credit', createdAt: new Date() };
      (prismaService.transfer.findFirst as jest.Mock).mockResolvedValue(transfer);
      (prismaService.transfer.delete as jest.Mock).mockResolvedValue(transfer);

      const result = await service.delete({ id: 1 });

      expect(result).toEqual({
        id: transfer.id,
        amount: transfer.amount,
        company_id: transfer.company_id,
        debit_account: transfer.debit_account,
        credit_account: transfer.credit_account,
        createdAt: transfer.createdAt,
      });
    });
  });

  describe('companiesWithTransfersLastMonth', () => {
    it('should return companies with transfers in the last month', async () => {
      const newDate = new Date('2025-01-01');
      const transfers = [{ id: 1, amount: 100, company_id: 1, debit_account: 'debit', credit_account: 'credit', createdAt: newDate, company: { id: 1, company_name: 'Company1', cuit: '12345' } }];
      const companies = [{ id: 1, company_name: 'Company1', cuit: '12345' }];
      (prismaService.transfer.findMany as jest.Mock).mockResolvedValue(transfers);
      (prismaService.company.findMany as jest.Mock).mockResolvedValue(companies);

      const result = await service.companiesWithTransfersLastMonth();

      expect(result).toEqual([{
        id: 1,
        name: 'Company1',
        cuit: '12345',
        transfers: [{
          id: 1,
          amount: 100,
          debit_account: 'debit',
          credit_account: 'credit',
          createdAt: newDate
        }]
      }]);
    });

    it('should throw an error if there is an issue retrieving companies', async () => {
      (prismaService.transfer.findMany as jest.Mock).mockRejectedValue(new Error('Error'));
      await expect(service.companiesWithTransfersLastMonth()).rejects.toThrow('Error getting companies with transfers in the last month. Error: Error');
    });
  });
});