import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCompanyDto {
    @ApiProperty({ example: '1234567890', description: 'The CUIT of the company' })
    @IsString()
    @IsNotEmpty()
    readonly companyCuit: string;

    @ApiProperty({ example: 'Company Name', description: 'The name of the company' })
    @IsString()
    @IsNotEmpty()
    readonly companyName: string;
    
    @ApiProperty({ example: '2021-01-01', description: 'The date of the company creation' })
    @IsString()
    @IsNotEmpty()
    readonly accesionDate: Date;}
