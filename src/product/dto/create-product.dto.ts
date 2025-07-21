// src/modules/product/dto/create-product.dto.ts

import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @Min(0)
  price: number;

  /** Stock inicial, por defecto 0 si no viene */
  @IsNumber()
  @Min(0)
  stock?: number;
}
