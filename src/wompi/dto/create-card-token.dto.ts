// src/modules/wompi/dto/create-card-token.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCardTokenDto {
  @IsString() @IsNotEmpty()
  number: string;
  @IsString() @IsNotEmpty()
  cvc: string;
  @IsString() @IsNotEmpty()
  exp_month: string;
  @IsString() @IsNotEmpty()
  exp_year: string;
  @IsString() @IsNotEmpty()
  card_holder: string;
}
