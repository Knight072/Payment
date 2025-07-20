// src/modules/customer/customer.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { CustomerRepositoryAdapter } from './adapters/customer.repository.adapter';
import { CustomerEntity } from './adapters/customer.entity';

@Module({
  imports: [
    // Registra la entidad Customer para TypeORM
    TypeOrmModule.forFeature([CustomerEntity]),
  ],
  controllers: [CustomerController],
  providers: [
    CustomerService,
    {
      provide: 'CustomerRepositoryPort',
      useClass: CustomerRepositoryAdapter,
    },
  ],
  exports: [],
})
export class CustomerModule {}
