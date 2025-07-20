// src/modules/transaction/transaction.controller.ts
import { Controller, Get, Post, Put, Delete, Param, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { Transaction } from './domain/transaction.model';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  /**
   * Lista todas las transacciones
   */
  @Get()
  async findAll(): Promise<Transaction[]> {
    return this.transactionService.findAll();
  }

  /**
   * Obtiene una transacción por ID
   */
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Transaction> {
    return this.transactionService.findById(id);
  }

  /**
   * Crea una nueva transacción
   */
  @Post()
  async create(@Body() dto: CreateTransactionDto): Promise<Transaction> {
    return this.transactionService.create(dto);
  }

  /**
   * Actualiza una transacción existente
   */
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateTransactionDto,
  ): Promise<Transaction> {
    return this.transactionService.update(id, dto);
  }

  /**
   * Elimina una transacción
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.transactionService.delete(id);
  }
}
