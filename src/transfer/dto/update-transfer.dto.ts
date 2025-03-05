import { PartialType } from '@nestjs/mapped-types';
import { CreateTransferDto } from './create-transfer.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateTransferDto extends PartialType(CreateTransferDto) {
    @ApiProperty({ example: 100, description: 'The amount of the transfer' })
    @IsNumber()
    readonly transferAmount: number;

    @ApiProperty({ example: 1, description: 'The id of the company that made the transfer' })
    @IsNumber()
    readonly transferCompanyId: number;

    @ApiProperty({ example: 'Debit Account', description: 'The debit account of the transfer' })
    @IsString()
    @IsOptional()
    readonly transferDebitAccount: string;

    @ApiProperty({ example: 'Credit Account', description: 'The credit account of the transfer' })
    @IsString()
    @IsOptional()
    readonly transferCreditAccount: string;
    @ApiProperty({ example: "2025-12-31", description: 'The date of the transfer' })
    @IsString()
    readonly createdAt: Date;
}
