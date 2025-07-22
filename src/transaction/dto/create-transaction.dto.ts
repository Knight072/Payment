import { IsString, IsNotEmpty, IsNumber, IsDateString, IsIn, IsOptional } from 'class-validator';

export class CreateTransactionDto {
  @IsString() @IsNotEmpty()
  description: string;

  @IsNumber()
  amount: number;

  @IsDateString() @IsNotEmpty()
  date: string;

  @IsString() @IsIn(['pending', 'completed', 'cancelled'])
  status: 'pending' | 'completed' | 'cancelled';

  @IsString() @IsNotEmpty()
  customerEmail: string;

  /** Si ya tienes token de tarjeta */
  @IsString() @IsOptional()
  cardToken?: string;

  /** Si envías los datos crudos para tokenizar */
  @IsString() @IsNotEmpty() @IsOptional()
  cardNumber?: string;

  @IsString() @IsNotEmpty() @IsOptional()
  cardCvc?: string;

  @IsString() @IsNotEmpty() @IsOptional()
  cardExpMonth?: string;

  @IsString() @IsNotEmpty() @IsOptional()
  cardExpYear?: string;
}
