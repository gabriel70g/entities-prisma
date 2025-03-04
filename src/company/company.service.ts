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
}