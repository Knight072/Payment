// src/modules/wompi/dto/create-payment.dto.ts
import {
  IsNumber,
  IsString,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class PaymentMethodDto {
  @IsString()
  @IsNotEmpty()
  type: 'CARD';

  @IsString()
  @IsNotEmpty()
  token: string;
}

export class CreatePaymentDto {
  @IsString()
  @IsNotEmpty()
  acceptance_token: string;

  @IsNumber()
  amount_in_cents: number;

  @IsString()
  @IsNotEmpty()
  currency: 'COP' | 'USD';

  @IsString()
  @IsNotEmpty()
  customer_email: string;

  @IsString()
  @IsNotEmpty()
  reference: string;

  @ValidateNested()
  @Type(() => PaymentMethodDto)
  payment_method: PaymentMethodDto;
}
