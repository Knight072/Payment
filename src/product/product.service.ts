// src/modules/product/product.service.ts
import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { ProductRepositoryPort } from './ports/product.repository.port';
import { Product } from './domain/product.model';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @Inject('ProductRepositoryPort')
    private readonly productRepo: ProductRepositoryPort,
  ) { }

  /**
   * Obtener todos los productos
   */
  async findAll(): Promise<Product[]> {
    return this.productRepo.findAll();
  }

  /**
   * Obtener un producto por ID
   */
  async findById(id: string): Promise<Product> {
    const product = await this.productRepo.findById(id);
    if (!product) {
      throw new NotFoundException(`Producto con id ${id} no encontrado`);
    }
    return product;
  }

  /**
   * Crear un nuevo producto
   */
  async create(dto: CreateProductDto): Promise<Product> {
    return this.productRepo.create(dto);
  }

  /**
   * Actualizar un producto existente
   */
  async update(id: string, dto: UpdateProductDto): Promise<Product> {
    await this.findById(id);
    return this.productRepo.update(id, dto);
  }

  /**
   * Eliminar un producto
   */
  async delete(id: string): Promise<void> {
    await this.findById(id);
    return this.productRepo.delete(id);
  }
}
