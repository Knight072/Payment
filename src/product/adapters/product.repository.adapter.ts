// src/modules/product/adapters/typeorm/product.repository.adapter.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductRepositoryPort } from '../ports/product.repository.port';
import { ProductEntity } from './product.entity';
import { Product } from '../domain/product.model';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';

@Injectable()
export class ProductRepositoryAdapter implements ProductRepositoryPort {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly repo: Repository<ProductEntity>,
  ) {}

  async findAll(): Promise<Product[]> {
    const entities = await this.repo.find();
    return entities.map(ProductEntity.toDomain);
  }

  async findById(id: string): Promise<Product | null> {
    const entity = await this.repo.findOne({ where: { id } });
    return entity ? ProductEntity.toDomain(entity) : null;
  }

  async create(dto: CreateProductDto): Promise<Product> {
    const entity = this.repo.create(dto);
    const saved = await this.repo.save(entity);
    return ProductEntity.toDomain(saved);
  }

  async update(id: string, dto: UpdateProductDto): Promise<Product> {
    await this.repo.update(id, dto);
    const updated = await this.repo.findOneOrFail({ where: { id } });
    return ProductEntity.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
