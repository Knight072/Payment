// src/modules/product/product.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductRepositoryAdapter } from './adapters/product.repository.adapter';
import { ProductEntity } from './adapters/product.entity';

@Module({
  imports: [
    // Registra la entidad para que TypeORM la gestione
    TypeOrmModule.forFeature([ProductEntity]),
  ],
  controllers: [ProductController],
  providers: [
    ProductService,
    {
      provide: 'ProductRepositoryPort',
      useClass: ProductRepositoryAdapter
    },
  ],
})
export class ProductModule { }
