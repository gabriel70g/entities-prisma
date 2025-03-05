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
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    companiesWithAdhesionDateLastMonth: jest.fn(),
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

  it('should create a company', async () => {
    const createCompanyDto: CreateCompanyDto = { companyName: 'Test Company', accesionDate: new Date('2023-10-01'), companyCuit:"123" };
    const result = { id: 1, ...createCompanyDto };
    mockCompanyService.create.mockResolvedValue(result);

    expect(await controller.create(createCompanyDto)).toBe(result);
    expect(mockCompanyService.create).toHaveBeenCalledWith(expect.any(Object));
  });

  it('should retrieve all companies', async () => {
    const result = [{ id: 1, companyName: 'Test Company', accesionDate: '2023-10-01' }];
    mockCompanyService.findAll.mockResolvedValue(result);

    expect(await controller.findAll()).toBe(result);
    expect(mockCompanyService.findAll).toHaveBeenCalledWith({});
  });

  it('should retrieve a single company', async () => {
    const result = { id: 1, companyName: 'Test Company', accesionDate: '2023-10-01' };
    mockCompanyService.findOne.mockResolvedValue(result);

    expect(await controller.findOne(1)).toBe(result);
    expect(mockCompanyService.findOne).toHaveBeenCalledWith({ id: 1 });
  });

  it('should update a company', async () => {
    const updateCompanyDto: UpdateCompanyDto = { companyName: 'Updated Company', accesionDate: '2023-10-02' };
    const result = { id: 1, ...updateCompanyDto };
    mockCompanyService.update.mockResolvedValue(result);

    expect(await controller.update(1, updateCompanyDto)).toBe(result);
    expect(mockCompanyService.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { company_name: 'Updated Company', accession_date: new Date('2023-10-02') },
    });
  });

  it('should delete a company', async () => {
    const result = { id: 1, companyName: 'Test Company', accesionDate: '2023-10-01' };
    mockCompanyService.delete.mockResolvedValue(result);

    expect(await controller.remove(1)).toBe(result);
    expect(mockCompanyService.delete).toHaveBeenCalledWith({ id: 1 });
  });

  it('should retrieve companies with adhesion date in the last month', async () => {
    const result = [{ id: 1, companyName: 'Test Company', accesionDate: '2023-10-01' }];
    mockCompanyService.companiesWithAdhesionDateLastMonth.mockResolvedValue(result);

    expect(await controller.companiesWithAdhesionDateLastMonth()).toBe(result);
    expect(mockCompanyService.companiesWithAdhesionDateLastMonth).toHaveBeenCalled();
  });
});
 