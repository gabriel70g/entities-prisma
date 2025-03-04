import { Test, TestingModule } from '@nestjs/testing';
import { CompanyService } from './company.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';

interface Company {
  id: number;
  name: string;
  industry: string;
  cuit: string;
}

describe('CompanyService', () => {
  let service: CompanyService;

  const mockPrisma = {
    company: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompanyService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<CompanyService>(CompanyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should retrieve a company by ID', async () => {
    const id = 123;
    const company: Company = { id, name: 'NestJS Corp', industry: 'Software', cuit: '123456789' };
    mockPrisma.company.findUnique.mockResolvedValue(company);

    const result = await service.findOne({ id });

    expect(mockPrisma.company.findUnique).toHaveBeenCalledWith({ where: { id } });
    expect(result).toEqual(company);
  });

  it('should create a company', async () => {
    const data = { name: 'New Company', industry: 'Tech', cuit: '987654321' };
    const createdCompany = { id: '123', ...data };
    mockPrisma.company.create.mockResolvedValue(createdCompany);

    const result = await service.create(data);

    expect(mockPrisma.company.create).toHaveBeenCalledWith({ data });
    expect(result).toEqual(createdCompany);
  });

  it('should update a company', async () => {
    const id = 123;
    const data = { name: 'Updated Company' };
    const updatedCompany = { id, ...data, cuit: '987654321' };
    mockPrisma.company.update.mockResolvedValue(updatedCompany);
    
    const result = await service.update({ where: { id }, data });

    expect(mockPrisma.company.update).toHaveBeenCalledWith({ where: { id }, data });
    expect(result).toEqual(updatedCompany);
  });

  it('should delete a company', async () => {
    const id = 123;
    const deletedCompany = { id, name: 'Deleted Company', industry: 'Tech', cuit: '987654321' };
    mockPrisma.company.delete.mockResolvedValue(deletedCompany);

    const result = await service.delete({ id });

    expect(mockPrisma.company.delete).toHaveBeenCalledWith({ where: { id } });
    expect(result).toEqual(deletedCompany);
  });
});