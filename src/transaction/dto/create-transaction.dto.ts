import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsDateString,
  IsIn,
  IsOptional,
  IsArray,
  ValidateNested,
  IsInt,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

// DTO para cada línea de ítem
export class TransactionItemDto {
  @IsString() @IsNotEmpty()
  name: string;

  @IsInt() @Min(1)
  quantity: number;
}

export class CreateTransactionDto {
  // Datos de la transacción
  @IsString() @IsNotEmpty()
  description: string;

  @IsNumber()
  amount: number;

  @IsDateString() @IsNotEmpty()
  date: string;

  @IsString() @IsIn(['pending', 'completed', 'cancelled'])
  status: 'pending' | 'completed' | 'cancelled';

  // — Campos de cliente —
  @IsString() @IsNotEmpty()
  firstName: string;

  @IsString() @IsNotEmpty()
  lastName: string;

  @IsString() @IsNotEmpty()
  document: string;

  @IsString() @IsOptional()
  phone?: string;

  @IsString() @IsNotEmpty()
  customerEmail: string;

  // — Campos de entrega —
  @IsString() @IsNotEmpty()
  address: string;

  @IsDateString() @IsNotEmpty()
  scheduledDate: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TransactionItemDto)
  items: TransactionItemDto[];

  // — Datos de tarjeta opcionales (para cuando actives Wompi) —
  @IsString() @IsOptional()
  cardToken?: string;

  @IsString() @IsNotEmpty() @IsOptional()
  cardNumber?: string;

  @IsString() @IsNotEmpty() @IsOptional()
  cardCvc?: string;

  @IsString() @IsNotEmpty() @IsOptional()
  cardExpMonth?: string;

  @IsString() @IsNotEmpty() @IsOptional()
  cardExpYear?: string;
}
