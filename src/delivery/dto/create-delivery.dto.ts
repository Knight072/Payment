// src/modules/delivery/dto/create-delivery.dto.ts
import { IsString, IsNotEmpty, IsDateString, IsUUID, IsIn, IsOptional } from 'class-validator';

export class CreateDeliveryDto {
  @IsUUID()
  @IsNotEmpty()
  orderId: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsDateString()
  scheduledDate: string;

  @IsString()
  @IsIn(['pending', 'in_transit', 'delivered', 'cancelled'])
  status: 'pending' | 'in_transit' | 'delivered' | 'cancelled';
}