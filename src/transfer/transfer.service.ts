
import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { Transfer, Prisma } from '@prisma/client';
import { BaseService } from '../generics/base-service';
import { datesLastMonth } from 'src/helpers/datesLastMonth';

@Injectable()
export class TransferService extends BaseService<
  Transfer,
  Prisma.TransferCreateInput,
  Prisma.TransferUpdateInput,
  Prisma.TransferWhereUniqueInput,
  Prisma.TransferWhereInput,
  Prisma.TransferOrderByWithRelationInput
  > {

    constructor(private readonly prismaService: PrismaService) {
      super(prismaService, prismaService.transfer);
    }

    async create(data: Prisma.TransferCreateInput): Promise<{ id: number; amount: number; company_id: number; debit_account: string; credit_account: string; createdAt: Date; }> {
      const companyId = data?.company.connect?.id;
      if (!companyId)
        throw new Error('company id is required')

      const company = await this.prismaService.company.findMany({
        where: {
          id: companyId
        }
      });

      if (!company) {
        throw new NotFoundException(`Company with id ${companyId} not found`);
      }

      const transfer = await this.prismaService.transfer.create({
        data
      });

      return {
        id: transfer.id,
        amount: transfer.amount,
        company_id: transfer.company_id,
        debit_account: transfer.debit_account,
        credit_account: transfer.credit_account,
        createdAt: transfer.createdAt
      };
    }    
    async update(params: { where: { id: number }; data: Prisma.TransferUpdateInput }): Promise<{ id: number; amount: number; company_id: number; debit_account: string; credit_account: string; createdAt: Date; }> {
      const { where, data } = params;

      const transfer = await this.prismaService.transfer.findFirst({
        where: { id: where.id },
      });

      if (!transfer) {
        throw new NotFoundException(`Transfer with id ${where.id} not found`);
      }

      const updatedTransfer = await this.prismaService.transfer.update({
        where,
        data
      });

      return {
        id: updatedTransfer.id,
        amount: updatedTransfer.amount,
        company_id: updatedTransfer.company_id,
        debit_account: updatedTransfer.debit_account,
        credit_account: updatedTransfer.credit_account,
        createdAt: updatedTransfer.createdAt
      };
    }
    async delete(where: Prisma.TransferWhereUniqueInput): Promise<{ id: number; amount: number; company_id: number; debit_account: string; credit_account: string; createdAt: Date; }> {
      const transfer = await this.prismaService.transfer.findFirst({
        where
      });

      if (!transfer) {
        throw new NotFoundException(`Transfer with id ${where.id} not found`);
      }

      await this.prismaService.transfer.delete({
        where
      });

      return {
        id: transfer.id,
        amount: transfer.amount,
        company_id: transfer.company_id,
        debit_account: transfer.debit_account,
        credit_account: transfer.credit_account,
        createdAt: transfer.createdAt
      };
    }

    //necesito un endpoint que traiga las empresas que hicieron transferencias el último mes
    //fijarse en las transferencias y luego hacer un resumen solo con las empresas sin las transferencias
    async companiesWithTransfersLastMonth() {
      try {
        const { startOfLastMonth, endOfLastMonth } = datesLastMonth();

        const transfers = await this.prismaService.transfer.findMany({
          where: {
            createdAt: {
              gte: startOfLastMonth,
              lte: endOfLastMonth
            }
          }
        });

        const companies = transfers.map(t => t.company_id); 

        return this.prismaService.company.findMany({
          where: {
            id: {
              in: companies
            }
          }
        });

      } catch (error) {
        throw new Error(`Error getting companies with transfers in the last month. Error: ${error}`);
      }   
    
  }
}