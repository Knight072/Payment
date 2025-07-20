// src/modules/delivery/delivery.service.ts
import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { DeliveryRepositoryPort } from './ports/delivery.repository.port';
import { Delivery } from './domain/delivery.model';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';

@Injectable()
export class DeliveryService {
  constructor(
    @Inject('DeliveryRepositoryPort')
    private readonly deliveryRepo: DeliveryRepositoryPort,
  ) {}

  /**
   * Lista todas las entregas
   */
  async findAll(): Promise<Delivery[]> {
    return this.deliveryRepo.findAll();
  }

  /**
   * Obtiene una entrega por ID
   */
  async findById(id: string): Promise<Delivery> {
    const delivery = await this.deliveryRepo.findById(id);
    if (!delivery) {
      throw new NotFoundException(`Entrega con id ${id} no encontrada`);
    }
    return delivery;
  }

  /**
   * Crea una nueva entrega
   */
  async create(dto: CreateDeliveryDto): Promise<Delivery> {
    return this.deliveryRepo.create(dto);
  }

  /**
   * Actualiza una entrega existente
   */
  async update(id: string, dto: UpdateDeliveryDto): Promise<Delivery> {
    await this.findById(id);
    return this.deliveryRepo.update(id, dto);
  }

  /**
   * Elimina una entrega
   */
  async delete(id: string): Promise<void> {
    await this.findById(id);
    return this.deliveryRepo.delete(id);
  }
}
