import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCompanyDto {
@ApiProperty({ example: 'Company Name', description: 'The name of the company' })
    @IsOptional()
    @IsString()
    companyName?: string;

    @ApiProperty({ example: '2021-09-01', description: 'The date of adhesion of the company' })
    @IsOptional()
    @IsString()
    accesionDate?: string;  
}
