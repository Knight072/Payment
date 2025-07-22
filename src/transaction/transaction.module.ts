// src/modules/transaction/transaction.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TransactionEntity }            from './adapters/transaction.entity';
import { TransactionRepositoryAdapter } from './adapters/transaction.repository.adapter';
import { TransactionService }           from './transaction.service';
import { TransactionController }        from './transaction.controller';

import { CustomerModule } from '../customer/customer.module';
import { DeliveryModule } from '../delivery/delivery.module';
import { ProductModule }  from '../product/product.module';  // ← importa aquí

@Module({
  imports: [
    TypeOrmModule.forFeature([TransactionEntity]),
    CustomerModule,
    DeliveryModule,
    ProductModule,   // ← para ProductRepositoryPort
  ],
  providers: [
    { provide: 'TransactionRepositoryPort', useClass: TransactionRepositoryAdapter },
    TransactionService,
  ],
  controllers: [TransactionController],
})
export class TransactionModule {}
