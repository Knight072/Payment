// src/modules/product/dto/create-product.dto.ts
import { IsString, IsNotEmpty, IsNumber, IsBoolean, IsOptional } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  price: number;

  @IsBoolean()
  @IsOptional()
  inStock?: boolean;
}
