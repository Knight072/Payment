// src/modules/delivery/adapters/typeorm/delivery.repository.adapter.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeliveryRepositoryPort } from '../ports/delivery.repository.port';
import { DeliveryEntity } from './delivery.entity';
import { Delivery } from '../domain/delivery.model';
import { CreateDeliveryDto } from '../dto/create-delivery.dto';
import { UpdateDeliveryDto } from '../dto/update-delivery.dto';

@Injectable()
export class DeliveryRepositoryAdapter implements DeliveryRepositoryPort {
  constructor(
    @InjectRepository(DeliveryEntity)
    private readonly repo: Repository<DeliveryEntity>,
  ) {}

  async findAll(): Promise<Delivery[]> {
    const entities = await this.repo.find();
    return entities.map(DeliveryEntity.toDomain);
  }

  async findById(id: string): Promise<Delivery | null> {
    const entity = await this.repo.findOne({ where: { id } });
    return entity ? DeliveryEntity.toDomain(entity) : null;
  }

  async create(dto: CreateDeliveryDto): Promise<Delivery> {
    const entity = this.repo.create(dto);
    const saved = await this.repo.save(entity);
    return DeliveryEntity.toDomain(saved);
  }

  async update(id: string, dto: UpdateDeliveryDto): Promise<Delivery> {
    await this.repo.update(id, dto);
    const updated = await this.repo.findOneOrFail({ where: { id } });
    return DeliveryEntity.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
