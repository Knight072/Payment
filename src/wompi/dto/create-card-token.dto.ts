import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCardTokenDto {
  @IsString()
  @IsNotEmpty()
  number: string;       // "4242424242424242"

  @IsString()
  @IsNotEmpty()
  cvv: string;          // "123"

  @IsString()
  @IsNotEmpty()
  exp_month: string;    // "08"

  @IsString()
  @IsNotEmpty()
  exp_year: string;     // "28"

  @IsString()
  @IsNotEmpty()
  card_holder: string;  // "JOSE PEREZ"
}
