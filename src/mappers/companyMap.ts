import { Company } from "@prisma/client";
import { CreateCompanyDto } from "src/company/dto/create-company.dto";

// src/mappers/mapToCompany.ts
export const mapToCompany = (companyDto: CreateCompanyDto) => {
    return {
      cuit: companyDto.companyCuit,
      company_name: companyDto.companyName,
      accession_date: new Date(companyDto.accesionDate),
    };
  };
  
  // src/mappers/mapToCompanyDto.ts
  export const mapToCompanyDto = (company: Company) => {
    return {
      cuit: company.cuit,
      companyName: company.company_name,
      accesionDate: company.accession_date,
      createdAt: company.createdAt,
    };
  };
