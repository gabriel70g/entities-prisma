import { Test, TestingModule } from '@nestjs/testing';
import { CompanyService } from './company.service';
import { PrismaService, } from '../prisma/prisma.service';
import { Company, Prisma } from '@prisma/client';
import { ConflictException } from '@nestjs/common';


describe('CompanyService', () => {
  let service: CompanyService;

  const mockPrisma = {
    company: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findFirst: jest.fn()
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

  it('should retrieve all companies', async () => {
    const companies = [
      { id: 1, company_name: 'Company 1', cuit: '123456789' },
      { id: 2, company_name: 'Company 2', cuit: '987654321' },
    ];
    mockPrisma.company.findMany.mockResolvedValue(companies);

    const result = await service.findAll({});

    expect(mockPrisma.company.findMany).toHaveBeenCalled();
    expect(result).toEqual(companies);
  });

  it('should retrieve a company by ID', async () => {
    const id = 123;
    // cspell: disable-next-line
    const company = { id, company_name: 'NestJS Corp', cuit: '123456789' };
    mockPrisma.company.findUnique.mockResolvedValue(company);

    const result = await service.findOne({ id });

    expect(mockPrisma.company.findUnique).toHaveBeenCalledWith({ where: { id } });
    expect(result).toEqual(company);
  });

  it('should create a company', async () => {
    const companyData: Prisma.CompanyCreateInput = {
      company_name: 'New Company',
      cuit: '123456789',
      accession_date: new Date(), // Asegúrate de incluir la propiedad accession_date
    };
    const createdCompany = { id: 1, ...companyData };
    mockPrisma.company.findUnique.mockResolvedValue(null); // No existing company with the same CUIT
    mockPrisma.company.create.mockResolvedValue(createdCompany);

    const result = await service.create(companyData);

    expect(mockPrisma.company.findUnique).toHaveBeenCalledWith({ where: { cuit: companyData.cuit } });
    expect(mockPrisma.company.create).toHaveBeenCalledWith({ data: companyData });
    expect(result).toEqual(createdCompany);
  });

  it('should throw conflict exception if company with same CUIT exists', async () => {
    const companyData: Prisma.CompanyCreateInput = {
      company_name: 'Existing Company',
      cuit: '123456789',
      accession_date: new Date(), // Ensure to include the property accession_date
    };
    const existingCompany = { id: 1, ...companyData };
    mockPrisma.company.findUnique.mockResolvedValue(existingCompany);

    expect(mockPrisma.company.findUnique).toHaveBeenCalledWith({ where: { cuit: companyData.cuit } });
    expect(mockPrisma.company.create).toHaveBeenCalled();
  });

  it('should update a company', async () => {
    const id = 123;
    const companyData: Prisma.CompanyUpdateInput = {
      company_name: 'Updated Company',
      accession_date: new Date(), // Asegúrate de incluir la propiedad accession_date si es requerida
    };
    const existingCompany = { id, company_name: 'Existing Company', cuit: '123456789', accession_date: new Date() };
    const { id: _, ...restOfExistingCompany } = existingCompany;
    const updatedCompany = { id, ...restOfExistingCompany, ...companyData };

    mockPrisma.company.findFirst.mockResolvedValue(existingCompany);
    mockPrisma.company.update.mockResolvedValue(updatedCompany);

    const result = await service.update({ where: { id }, data: companyData });

    expect(mockPrisma.company.findFirst).toHaveBeenCalledWith({ where: { id } });
    expect(mockPrisma.company.update).toHaveBeenCalledWith({ where: { id }, data: companyData });
    expect(result).toEqual(updatedCompany);
  });
  it('should delete a company', async () => {
    const id = 123;
    const company = { id, company_name: 'Existing Company', cuit: '123456789' };
    mockPrisma.company.findFirst.mockResolvedValue(company);
    mockPrisma.company.delete.mockResolvedValue(company);

    const result = await service.delete({ id });

    expect(mockPrisma.company.findFirst).toHaveBeenCalledWith({ where: { id } });
    expect(mockPrisma.company.delete).toHaveBeenCalledWith({ where: { id } });
    expect(result).toEqual(company);
  });
});