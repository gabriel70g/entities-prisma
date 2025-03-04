import { ApiProperty } from '@nestjs/swagger';

export class CreateCompanyDto {
    @ApiProperty({ example: '1234567890', description: 'The CUIT of the company' })
    readonly companyCuit: string;

    @ApiProperty({ example: 'Company Name', description: 'The name of the company' })
    readonly companyName: string;
    
    @ApiProperty({ example: '2021-01-01', description: 'The date of the company creation' })
    readonly accesionDate: Date;}
