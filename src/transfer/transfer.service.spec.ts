import { Test, TestingModule } from '@nestjs/testing';
import { TransferService } from './transfer.service';
import { PrismaModule } from '../prisma/prisma.module';
import { CompanyService } from '../company/company.service';

describe('TransferService', () => {
  let service: TransferService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [TransferService, CompanyService],
    }).compile();

    service = module.get<TransferService>(TransferService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
