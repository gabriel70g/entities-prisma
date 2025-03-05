
import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { Transfer, Prisma } from '@prisma/client';
import { BaseService } from '../generics/base-service';
import { datesLastMonth } from 'src/helpers/datesLastMonth';
import { UpdateTransferDto } from './dto/update-transfer.dto';
import { mapToTransferUpdate } from 'src/mappers/transferMap';
import { logger } from 'src/logger/loggerBase';

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
      const companyId = data?.company?.connect?.id;
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
        debit_account: transfer.debit_account||'-',
        credit_account: transfer.credit_account||'-',
        createdAt: transfer.createdAt
      };
    }    
    async updateTransfer(id: number, data: UpdateTransferDto): Promise<Transfer> {
      const transfer = await this.prismaService.transfer.findFirst({
        where: { id },
      });
    
      if (!transfer) {
        throw new NotFoundException(`Transfer with id ${id} not found`);
      }
    
      const updateData = mapToTransferUpdate(data);
    
      const updatedTransfer = await this.prismaService.transfer.update({
        where: { id },
        data: updateData,
      });
    
      logger.info(`Transfer with id ${id} updated successfully`);
    
      return updatedTransfer;
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
        debit_account: transfer.debit_account||'-',
        credit_account: transfer.credit_account||'-',
        createdAt: transfer.createdAt
      };
    }

    async companiesWithTransfersLastMonth() {
      try {
        const { startOfLastMonth, endOfLastMonth } = datesLastMonth();
    
        // Obtener las transferencias en el último mes
        const transfers = await this.prismaService.transfer.findMany({
          where: {
            createdAt: {
              gte: startOfLastMonth,
              lte: endOfLastMonth
            }
          },
          include: {
            company: true, // Incluir la información de la compañía en la transferencia
          }
        });
    
        // Filtrar las compañías que tienen transferencias
        const companiesWithTransfers = transfers.reduce((acc, transfer) => {
          const companyId = transfer.company_id;
          // si no existe la compañía en el objeto, se crea
          if (!acc[companyId]) {
            acc[companyId] = {
              id: transfer.company.id,
              name: transfer.company.company_name,
              cuit: transfer.company.cuit,
              transfers: []
            };
          }
          // se añade la transferencia a la compañía
          acc[companyId].transfers.push({
            id: transfer.id,
            amount: transfer.amount,
            debit_account: transfer.debit_account,
            credit_account: transfer.credit_account,
            createdAt: transfer.createdAt
          });
          return acc;
        }, {});
    
        // Convertir el objeto en un array
        return Object.values(companiesWithTransfers);
    
      } catch (error) {
        throw new Error(`Error getting companies with transfers in the last month. Error: ${error}`);
      }
    }
}