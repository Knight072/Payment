// src/modules/customer/customer.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CustomerEntity }             from './adapters/customer.entity';
import { CustomerRepositoryAdapter }  from './adapters/customer.repository.adapter';
import { CustomerService }            from './customer.service';
import { CustomerController }         from './customer.controller';

@Module({
  imports: [ TypeOrmModule.forFeature([CustomerEntity]) ],
  providers: [
    { provide: 'CustomerRepositoryPort', useClass: CustomerRepositoryAdapter },
    CustomerService,
  ],
  controllers: [CustomerController],
  exports: [
    'CustomerRepositoryPort',
    CustomerService,       // si otros servicios lo usan
  ],
})
export class CustomerModule {}
