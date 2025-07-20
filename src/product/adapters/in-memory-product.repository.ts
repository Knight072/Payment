// src/modules/product/adapters/in-memory-product.repository.ts
import { Injectable } from '@nestjs/common';
import { ProductRepositoryPort } from '../ports/product.repository.port';
import { Product } from '../domain/product.model';

@Injectable()
export class InMemoryProductRepository implements ProductRepositoryPort {
  private products: Product[] = [
    new Product('1', 'Producto de prueba A', 100, true),
    new Product('2', 'Producto de prueba B', 200, false),
  ];

  findAll(): Promise<Product[]> {
    return Promise.resolve(this.products);
  }
  findById(id: string): Promise<Product | null> {
    const p = this.products.find(x => x.id === id) ?? null;
    return Promise.resolve(p);
  }
  create(dto: any): Promise<Product> {
    const nuevo = new Product(
      (this.products.length + 1).toString(),
      dto.name,
      dto.price,
      dto.inStock ?? true,
    );
    this.products.push(nuevo);
    return Promise.resolve(nuevo);
  }
  update(id: string, dto: any): Promise<Product> {
    const idx = this.products.findIndex(x => x.id === id);
    if (idx < 0) return Promise.reject('No encontrado');
    const p = this.products[idx];
    p.name = dto.name ?? p.name;
    p.price = dto.price ?? p.price;
    p.inStock = dto.inStock ?? p.inStock;
    return Promise.resolve(p);
  }
  delete(id: string): Promise<void> {
    this.products = this.products.filter(x => x.id !== id);
    return Promise.resolve();
  }
}
