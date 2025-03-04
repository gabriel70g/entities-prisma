import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Company } from './entities/company.entity';

@ApiTags('Companies') // Etiqueta en Swagger
@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Company created successfully', type: Company })
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companyService.create({cuit: createCompanyDto.companyCuit, companyName: createCompanyDto.companyName}, 'cuit', undefined);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'Retrieve all companies', type: [Company] })
  findAll() {
    return this.companyService.findMany({});
  }

  @ApiResponse({ status: 200, description: 'Retrieve a single company', type: Company })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companyService.findOne({id: parseInt(id)});
  }

  @Patch(':id')
  @ApiResponse({ status: 200, description: 'Company updated successfully', type: Company })
  update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companyService.update({
      where: { id: +id },
      data: { companyName: updateCompanyDto.companyName }
    });
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Company deleted successfully', type: Company })
  remove(@Param('id') id: string) {
    return this.companyService.delete({id: parseInt(id)});
  }
}
