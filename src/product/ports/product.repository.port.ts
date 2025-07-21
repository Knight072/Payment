// src/modules/product/ports/product.repository.port.ts

import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { Product }          from '../domain/product.model';

export interface ProductRepositoryPort {
  findAll(): Promise<Product[]>;
  findById(id: string): Promise<Product | null>;
  create(dto: CreateProductDto): Promise<Product>;
  update(id: string, dto: UpdateProductDto): Promise<Product>;
  delete(id: string): Promise<void>;
  increaseStock(id: string, amount: number): Promise<Product>;
  decreaseStock(id: string, amount: number): Promise<Product>;
}
