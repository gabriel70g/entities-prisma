import { IdentityCardLocale } from './../../node_modules/@types/validator/es/lib/isIdentityCard.d';
import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Company, Prisma } from '@prisma/client';
import { BaseService } from 'src/generics/base-service';
import { logger } from 'src/logger/loggerBase';
import { datesLastMonth } from 'src/helpers/datesLastMonth';

@Injectable()
export class CompanyService extends BaseService<
  Company,
  Prisma.CompanyCreateInput,
  Prisma.CompanyUpdateInput,
  Prisma.CompanyWhereUniqueInput,
  Prisma.CompanyWhereInput,
  Prisma.CompanyOrderByWithRelationInput
> {
  constructor(private readonly prismaService: PrismaService) {
    super(prismaService, prismaService.company);
  }

  async create(data: Prisma.CompanyCreateInput): Promise<Company> {
    const companyCuit = data.cuit;

    // Before adding a new one, I must verify that there is not one with the same CUIT
    const companyFound = await this.prismaService.company.findUnique({
      where: { cuit: companyCuit },
    });

    if (companyFound) {
      logger.error(`Company with this CUIT ${companyCuit} already exists`);
      throw new ConflictException(`Company with this CUIT ${companyCuit} already exists`);
    }

    return super.create(data);
  }
  async update(params: { where: { id: number }; data: Prisma.CompanyUpdateInput }): Promise<Company> {
    const { where, data } = params;

    // Verify if the company with the given id exists
    const companyFound = await this.prismaService.company.findFirst({
      where: { id: where.id },
    });

    if (!companyFound) {
      logger.error(`Company with id ${where.id} does not exist`);
      throw new BadRequestException(`Company with id ${where.id} does not exist`);
    }

    return super.update({ where, data });
  }

  async delete(where: Prisma.CompanyWhereUniqueInput): Promise<Company> {
    // Verify if the company with the given id exists before deleting it
    const companyFound = await this.prismaService.company.findFirst({
      where: { id: where.id },
    });

    if (!companyFound) {
      logger.error(`Company with id ${where.id} does not exist`);
      throw new BadRequestException(`Company with id ${where.id} does not exist`);
    }

    return super.delete(where);
  }

  async companiesWithAdhesionDateLastMonth() {
    try {
      const { startOfLastMonth, endOfLastMonth } = datesLastMonth();

      logger.info(`startOfLastMonth: ${startOfLastMonth}`);
      logger.info(`endOfLastMonth: ${endOfLastMonth}`);

      return this.findAll({
        where: {
          accession_date: {
            gte: startOfLastMonth,
            lte: endOfLastMonth
          }
        }
      });
    }
    catch (error) {
      logger.error(error);
      throw new BadRequestException(`Error getting companies with adhesion date in the last month. Error: ${error}`);
    }
  }
}