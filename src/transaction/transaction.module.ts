// src/modules/transaction/transaction.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WompiModule } from '../wompi/wompi-client.module';

import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { TransactionRepositoryAdapter } from './adapters/transaction.repository.adpter';
import { TransactionEntity } from './adapters/transaction.entity';

@Module({
    imports: [
        // Registra la entidad para que TypeORM la gestione
        TypeOrmModule.forFeature([TransactionEntity]),
        WompiModule,
    ],
    controllers: [TransactionController],
    providers: [
        TransactionService,
        {
            // Inyecta la implementación concreta usando el port
            provide: 'TransactionRepositoryPort',
            useClass: TransactionRepositoryAdapter,
        },
    ],
})
export class TransactionModule { }
