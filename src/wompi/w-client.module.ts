import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { WClientPort }    from './ports/w-client.port';
import { WClientAdapter } from './adapters/w-client.adapter';
import { WService }       from './w.service';

@Module({
  imports: [
    ConfigModule,
    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject:  [ConfigService],
      useFactory: (cs: ConfigService) => ({
        baseURL: cs.get<string>('W_BASE_URL'),
        headers: {
          Authorization: `Bearer ${cs.get<string>('W_PRIVATE_KEY')}`,
          'Content-Type': 'application/json',
        },
      }),
    }),
  ],
  providers: [
    { provide: WClientPort, useClass: WClientAdapter },
    WService,
  ],
  exports: [
    WClientPort,
    WService,
  ],
})
export class WModule {}
