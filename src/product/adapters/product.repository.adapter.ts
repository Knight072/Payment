// src/modules/product/adapters/product.repository.adapter.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProductRepositoryPort } from '../ports/product.repository.port';
import { CreateProductDto }       from '../dto/create-product.dto';
import { UpdateProductDto }       from '../dto/update-product.dto';
import { ProductEntity }          from './product.entity';
import { Product }                from '../domain/product.model';

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
    const entity = await this.repo.findOneBy({ id });
    return entity ? ProductEntity.toDomain(entity) : null;
  }

  async create(dto: CreateProductDto): Promise<Product> {
    const entity = this.repo.create({
      name: dto.name,
      description: dto.description,
      price: dto.price,
      stock: dto.stock ?? 0,
    });
    const saved = await this.repo.save(entity);
    return ProductEntity.toDomain(saved);
  }

  async update(id: string, dto: UpdateProductDto): Promise<Product> {
    const existing = await this.repo.findOneBy({ id });
    if (!existing) throw new Error(`Producto ${id} no existe`);
    const updated = this.repo.merge(existing, {
      name:        dto.name        ?? existing.name,
      description: dto.description ?? existing.description,
      price:       dto.price       ?? existing.price,
      stock:       dto.stock       ?? existing.stock,
    });
    const saved = await this.repo.save(updated);
    return ProductEntity.toDomain(saved);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }

  /** 🔄 Métodos de stock nuevos */

  async increaseStock(id: string, amount: number): Promise<Product> {
    const entity = await this.repo.findOneBy({ id });
    if (!entity) throw new Error(`Producto ${id} no existe`);
    // Ajustamos el stock
    entity.stock += amount;
    const saved = await this.repo.save(entity);
    return ProductEntity.toDomain(saved);
  }

  async decreaseStock(id: string, amount: number): Promise<Product> {
    const entity = await this.repo.findOneBy({ id });
    if (!entity) throw new Error(`Producto ${id} no existe`);
    if (entity.stock - amount < 0) {
      throw new Error('No hay suficiente stock');
    }
    entity.stock -= amount;
    const saved = await this.repo.save(entity);
    return ProductEntity.toDomain(saved);
  }
}
