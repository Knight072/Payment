// src/modules/delivery/delivery.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DeliveryController } from './delivery.controller';
import { DeliveryService } from './delivery.service';
import { DeliveryRepositoryAdapter } from './adapters/delivery.repository.adapter';
import { DeliveryEntity } from './adapters/delivery.entity';

@Module({
    imports: [
        // Registra la entidad Delivery para TypeORM
        TypeOrmModule.forFeature([DeliveryEntity]),
    ],
    controllers: [DeliveryController],
    providers: [
        DeliveryService,
        {
            provide: 'DeliveryRepositoryPort',
            useClass: DeliveryRepositoryAdapter,
        },
    ],
    exports: [],
})
export class DeliveryModule { }
