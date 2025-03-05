import { mapToCompany, mapToCompanyDto } from './companyMap';
import { CreateCompanyDto } from 'src/company/dto/create-company.dto';
import { Company } from '@prisma/client';

describe('Company Mappers', () => {

    it('should map CreateCompanyDto to Company entity', () => {
        const createCompanyDto: CreateCompanyDto = {
            companyCuit: '123456789',
            companyName: 'Test Company',
            accesionDate: new Date('2023-01-01'),
        };

        const result = mapToCompany(createCompanyDto);

        expect(result).toEqual({
            cuit: '123456789',
            company_name: 'Test Company',
            accession_date: new Date('2023-01-01'),
        });
    });

    it('should map Company entity to CreateCompanyDto', () => {
        const company: Company = {
            id: 1,
            cuit: '123456789',
            company_name: 'Test Company',
            accession_date: new Date('2023-01-01'),
            createdAt: new Date('2023-01-01'),
        };

        const result = mapToCompanyDto(company);

        expect(result).toEqual({
            cuit: '123456789',
            companyName: 'Test Company',
            accesionDate: new Date('2023-01-01'),
            createdAt: new Date('2023-01-01'),
        });
    });
});