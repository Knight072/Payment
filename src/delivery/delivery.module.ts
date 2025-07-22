// src/modules/delivery/delivery.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DeliveryEntity }             from './adapters/delivery.entity';
import { DeliveryRepositoryAdapter }  from './adapters/delivery.repository.adapter';
import { DeliveryService }            from './delivery.service';
import { DeliveryController }         from './delivery.controller';

@Module({
  imports: [ TypeOrmModule.forFeature([DeliveryEntity]) ],
  providers: [
    { provide: 'DeliveryRepositoryPort', useClass: DeliveryRepositoryAdapter },
    DeliveryService,
  ],
  controllers: [DeliveryController],
  exports: [
    'DeliveryRepositoryPort',
    DeliveryService,
  ],
})
export class DeliveryModule {}
