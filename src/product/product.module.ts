// src/modules/product/product.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductEntity }            from './adapters/product.entity';
import { ProductRepositoryAdapter } from './adapters/product.repository.adapter';
import { ProductService }           from './product.service';
import { ProductController }        from './product.controller';

@Module({
  imports: [ TypeOrmModule.forFeature([ProductEntity]) ],
  providers: [
    // Define el puerto y su adaptador
    { provide: 'ProductRepositoryPort', useClass: ProductRepositoryAdapter },
    ProductService,
  ],
  controllers: [ProductController],
  exports: [
    // Exporta el puerto para que otros módulos puedan usarlo
    'ProductRepositoryPort',
    ProductService,
  ],
})
export class ProductModule {}
