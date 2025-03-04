import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCompanyDto {
@ApiProperty({ example: 'Company Name', description: 'The name of the company' })
    @IsOptional()
    @IsString()
    companyName?: string;
}
