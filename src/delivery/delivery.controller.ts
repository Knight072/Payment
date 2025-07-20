// src/modules/delivery/delivery.controller.ts
import { Controller, Get, Post, Put, Delete, Param, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { Delivery } from './domain/delivery.model';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';

@Controller('deliveries')
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  /**
   * Lista todas las entregas
   */
  @Get()
  async findAll(): Promise<Delivery[]> {
    return this.deliveryService.findAll();
  }

  /**
   * Obtiene una entrega por ID
   */
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Delivery> {
    return this.deliveryService.findById(id);
  }

  /**
   * Crea una nueva entrega
   */
  @Post()
  async create(@Body() dto: CreateDeliveryDto): Promise<Delivery> {
    return this.deliveryService.create(dto);
  }

  /**
   * Actualiza una entrega existente
   */
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateDeliveryDto,
  ): Promise<Delivery> {
    return this.deliveryService.update(id, dto);
  }

  /**
   * Elimina una entrega
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.deliveryService.delete(id);
  }
}
