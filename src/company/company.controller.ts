import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, ParseIntPipe } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Company } from './entities/company.entity';
import { mapToCompany } from 'src/mappers/companyMap';
import { logger } from 'src/logger/loggerBase';

@ApiTags('Companies')
@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Company created successfully', type: Company })
  @UsePipes(new ValidationPipe({ transform: true }))
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companyService.create(mapToCompany(createCompanyDto));
  }

  @Get('adhesion-date-last-month')
  @ApiResponse({ status: 200, description: 'Retrieve companies with adhesion date in the last month', type: Company })
  companiesWithAdhesionDateLastMonth() {
    logger.info('companiesWithAdhesionDateLastMonth');
    return this.companyService.companiesWithAdhesionDateLastMonth()
  } 

  @Get()
  @ApiResponse({ status: 200, description: 'Retrieve all companies', type: [Company] })
  findAll() {
    return this.companyService.findAll({})
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Retrieve a single company', type: Company })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.companyService.findOne({ id });
  }


  @Patch(':id')
  @ApiResponse({ status: 200, description: 'Company updated successfully', type: Company })
  @UsePipes(new ValidationPipe({ transform: true }))
  update(@Param('id', ParseIntPipe) id: number, @Body() updateCompanyDto: UpdateCompanyDto) {
    const updateData: { company_name?: string; accession_date?: Date } = {
      company_name: updateCompanyDto.companyName,
    };
    if (updateCompanyDto?.accesionDate) {
      updateData.accession_date = new Date(Date.parse(updateCompanyDto.accesionDate));
    }

    return this.companyService.update({
      where: { id },
      data: updateData,
    }); 
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Company deleted successfully', type: Company })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.companyService.delete({ id });
  }


}
