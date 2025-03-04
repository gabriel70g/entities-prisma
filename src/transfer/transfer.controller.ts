import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TransferService } from './transfer.service';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { UpdateTransferDto } from './dto/update-transfer.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Transfer } from './entities/transfer.entity';

@ApiTags('Transfers')
@Controller('transfer')
export class TransferController {
  constructor(private readonly transferService: TransferService) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Transfer created successfully' })
  create(@Body() createTransferDto: CreateTransferDto) {
    const transferData = {
      amount: createTransferDto.transferAmount,
      companyId: createTransferDto.transferCompanyId,
      debitAccount: createTransferDto.transferDebitAccount,
      creditAccount: createTransferDto.transferCreditAccount,
      createdAt: new Date().toISOString(),
    };
    return this.transferService.create(transferData, 'company_id');
  }

  @Get()
  @ApiResponse({ status: 200, description: 'Retrieve all transfers', type: [Transfer] })  
  findAll() {
    return this.transferService.findMany();
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Retrieve a single transfer', type: Transfer })
  findOne(@Param('id') id: string) {
    return this.transferService.findOne({ id: +id });
  }

  @Patch(':id')
  @ApiResponse({ status: 200, description: 'Transfer updated successfully', type: Transfer })
  update(@Param('id') id: string, @Body() updateTransferDto: UpdateTransferDto) {
    const updateData = {
      amount: updateTransferDto.transferAmount,
      companyId: updateTransferDto.transferCompanyId,
      debitAccount: updateTransferDto.transferDebitAccount,
      creditAccount: updateTransferDto.transferCreditAccount,
      createdAt: new Date().toISOString(),
    };
    return this.transferService.update({
      where: { id: +id },
      data: updateData
    });
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Transfer deleted successfully', type: Transfer })
  remove(@Param('id') id: string) {
    return this.transferService.delete({ id: +id });
  }
}