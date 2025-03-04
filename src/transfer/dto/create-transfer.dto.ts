import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsDateString } from 'class-validator';

export class CreateTransferDto {
  @ApiProperty({ example: 100, description: 'The amount of the transfer' })
  @IsNumber()
  readonly transferAmount: number;

  @ApiProperty({ example: 1, description: 'The id of the company that made the transfer' })
  @IsNumber()
  readonly transferCompanyId: number;

  @ApiProperty({ example: 'Debit Account', description: 'The debit account of the transfer' })
  @IsString()
  readonly transferDebitAccount: string;

  @ApiProperty({ example: 'Credit Account', description: 'The credit account of the transfer' })
  @IsString()
  readonly transferCreditAccount: string;

}