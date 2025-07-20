// src/modules/transaction/dto/create-transaction.dto.ts
import { IsString, IsNotEmpty, IsNumber, IsDateString, IsIn, IsOptional } from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  amount: number;

  @IsDateString()
  date: string;

  @IsString()
  @IsIn(['pending', 'completed', 'cancelled'])
  status: 'pending' | 'completed' | 'cancelled';
}