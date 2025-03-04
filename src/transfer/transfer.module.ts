import { Module } from '@nestjs/common';
import { TransferService } from './transfer.service';
import { TransferController } from './transfer.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CompanyService } from 'src/company/company.service';

@Module({
  imports: [PrismaModule],
  controllers: [TransferController],
  providers: [TransferService, CompanyService],
})
export class TransferModule {}
