// src/modules/product/ports/product.repository.port.ts

import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { Product } from '../domain/product.model';

export interface ProductRepositoryPort {
  /**
   * Devuelve todos los productos
   */
  findAll(): Promise<Product[]>;

  /**
   * Busca un producto por su ID. Retorna null si no existe.
   */
  findById(id: string): Promise<Product | null>;

  /**
   * Crea un nuevo producto a partir del DTO proporcionado.
   */
  create(dto: CreateProductDto): Promise<Product>;

  /**
   * Actualiza un producto existente identificado por ID con el DTO proporcionado.
   */
  update(id: string, dto: UpdateProductDto): Promise<Product>;

  /**
   * Elimina el producto identificado por ID.
   */
  delete(id: string): Promise<void>;
}
