import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { WompiClientPort }    from './ports/wompi-client.port';
import { WompiClientAdapter } from './adapters/wompi-client.adapter';
import { WompiService }       from './wompi.service';

@Module({
  imports: [
    ConfigModule,
    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject:  [ConfigService],
      useFactory: (cs: ConfigService) => ({
        baseURL: cs.get<string>('WOMPI_BASE_URL'),
        headers: {
          Authorization: `Bearer ${cs.get<string>('WOMPI_PRIVATE_KEY')}`,
          'Content-Type': 'application/json',
        },
      }),
    }),
  ],
  providers: [
    { provide: WompiClientPort, useClass: WompiClientAdapter },
    WompiService,
  ],
  exports: [
    WompiClientPort,
    WompiService,
  ],
})
export class WompiModule {}
