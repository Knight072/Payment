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

  @IsString()
  customerEmail: string;

  @IsString()
  @IsOptional()
  cardToken?: string;

  /**
   * Si no tienes cardToken, envia estos datos para tokenizar:
   */
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  cardNumber?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  cardCvc?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  cardExpMonth?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  cardExpYear?: string;
}