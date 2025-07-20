// src/modules/product/adapters/product.entity.ts

import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from '../domain/product.model';

@Entity({ name: 'products' })
export class ProductEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'decimal', precision: 12, scale: 2 })
    price: number;

    @Column({ type: 'boolean', default: true })
    inStock: boolean;

    /**
     * Convierte la entidad a su modelo de dominio
     */
    static toDomain(entity: ProductEntity): Product {
        return new Product(
            entity.id,
            entity.name,
            Number(entity.price),
            entity.inStock
        );
    }

    /**
     * Crea una nueva entidad a partir del modelo de dominio
     */
    static fromDomain(product: Product): ProductEntity {
        const entity = new ProductEntity();
        entity.id = product.id;
        entity.name = product.name;
        entity.price = product.price;
        entity.inStock = product.inStock;
        return entity;
    }
}
