// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from './product/product.module';
import { TransactionModule } from './transaction/transaction.module';
import { CustomerModule } from './customer/customer.module';
import { DeliveryModule } from './delivery/delivery.module';
//import { WModule } from './api/w-client.module';
import configuration from './configuration';

@Module({
  imports: [
    // Configuración de entornos
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: ['.env', '.env.prod'],
    }),
    // Conexión a la base de datos
    TypeOrmModule.forRoot({
      type: 'postgres',
      autoLoadEntities: true,
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT ?? '5432', 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      synchronize: process.env.NODE_ENV !== 'production',
    }),
    // Módulos de la aplicación
    ProductModule,
    TransactionModule,
    CustomerModule,
    DeliveryModule,
    //WModule
  ],
})
export class AppModule {}