import { Test, TestingModule } from '@nestjs/testing';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

describe('CompanyController', () => {
  let controller: CompanyController;
  let service: CompanyService;

  const mockCompanyService = {
    create: jest.fn(),
    findMany: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyController],
      providers: [
        { provide: CompanyService, useValue: mockCompanyService },
        PrismaService,
      ],
    }).compile();

    controller = module.get<CompanyController>(CompanyController);
    service = module.get<CompanyService>(CompanyService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a company', async () => {
      const createCompanyDto: CreateCompanyDto = { companyCuit: '123456789', companyName: 'Test Company' };
      const result = { id: 1, cuit: createCompanyDto.companyCuit, companyName: createCompanyDto.companyName, createdAt: new Date() };

      jest.spyOn(service, 'create').mockResolvedValue(result);

      expect(await controller.create(createCompanyDto)).toBe(result);
    });
  });

  describe('findAll', () => {
    it('should return an array of companies', async () => {
      const result = [{ id: 1, cuit: '123456789', companyName: 'Test Company', createdAt: new Date() }];

      jest.spyOn(service, 'findMany').mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a single company', async () => {
      const result = { id: 1, cuit: '123456789', companyName: 'Test Company', createdAt: new Date() };

      jest.spyOn(service, 'findOne').mockResolvedValue(result);

      expect(await controller.findOne('1')).toBe(result);
    });
  });

  describe('update', () => {
    it('should update a company', async () => {
      const updateCompanyDto: UpdateCompanyDto = { companyName: 'Updated Company' };
      const result = { id: 1, cuit: '123456789', companyName: 'Updated Company', createdAt: new Date() };

      jest.spyOn(service, 'update').mockResolvedValue(result);

      expect(await controller.update('1', updateCompanyDto)).toBe(result);
    });
  });

  describe('remove', () => {
    it('should delete a company', async () => {
      const result = { id: 1, cuit: '123456789', companyName: 'Test Company', createdAt: new Date() };

      jest.spyOn(service, 'delete').mockResolvedValue(result);

      expect(await controller.remove('1')).toBe(result);
    });
  });
});