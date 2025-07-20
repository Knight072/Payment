// src/modules/customer/dto/create-customer.dto.ts
import { IsString, IsNotEmpty, IsEmail, IsOptional } from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  document: string;

  @IsString()
  @IsOptional()
  phone?: string;
}