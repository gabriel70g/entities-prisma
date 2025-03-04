
import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { Transfer, Prisma, Company } from '@prisma/client';
import { BaseService } from '../generics/base-service';
import { CompanyService } from '../company/company.service';

@Injectable()
export class TransferService extends BaseService<
  Transfer,
  Prisma.TransferWhereUniqueInput,
  Prisma.TransferWhereInput
> {

  constructor(prisma: PrismaService,
    private readonly companyService: CompanyService) {
    super(prisma, prisma.transfer);
    companyService = companyService;

  }

  async create(data: any, uniqueField?: keyof Prisma.TransferWhereUniqueInput, specificField?: keyof Prisma.TransferWhereInput): Promise<Transfer> {
    try {
      // antes de hacer una trasaferencia se debe verificar que la empresa que se esta recibiendo exista
      await this.companyService.findOne({ id: data.companyId });
    }
    catch (error) {
      throw new NotFoundException(`Company not found`);
    }

    return super.create(data, uniqueField, specificField);
  }

  // empresa con trasnferencias en el ultimo mes
  async companyWithTransfersLastMonth(): Promise<Company[]> {
    return this.companyService.findMany({
      where: {
        transfers: {
          some: {
            createdAt: {
              gte: new Date(new Date().setMonth(new Date().getMonth() - 1))
            }
          }
        }
      }
    });
  }
}