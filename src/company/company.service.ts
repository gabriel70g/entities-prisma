import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Company, Prisma } from '@prisma/client';
import { BaseService } from '../generics/base-service';

@Injectable()
export class CompanyService extends BaseService<
  Company,
  Prisma.CompanyWhereUniqueInput,
  Prisma.CompanyWhereInput
> {
  constructor(prisma: PrismaService) {
    super(prisma, prisma.company);
  }

  // empresas que regisradas en el ultimo mes
  async companiesRegisteredLastMonth(): Promise<Company[]> {
    return  super.findMany({
      where: {
        createdAt: {
          gte: new Date(new Date().setMonth(new Date().getMonth() - 1))
        }
      }
    });
  }

  // empresas con fecha de adhesion en el ultimo mes
  async companiesWithAdhesionDateLastMonth(): Promise<Company[]> {
    return super.findMany({
      where: {
        accession_date: {
          gte: new Date(new Date().setMonth(new Date().getMonth() - 1))
        }
      }
    });
  }

}