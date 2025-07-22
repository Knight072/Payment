// src/modules/wompi/wompi.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WompiClientPort } from './ports/wompi-client.port';
import { CreateCardTokenDto } from './dto/create-card-token.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class WompiService {
  private publicKey: string;

  constructor(
    private readonly config: ConfigService,
    @Inject(WompiClientPort) private readonly client: WompiClientPort,
  ) {
    const pk = this.config.get<string>('WOMPI_PUBLIC_KEY');
    if (!pk) {
      throw new Error('WOMPI_PUBLIC_KEY no definida en .env');
    }
    this.publicKey = pk;
  }

  /** Paso 2: obtiene merchant y extrae el acceptance_token */
  async getAcceptanceToken(): Promise<string> {
    const merchant = await this.client.getMerchant(this.publicKey);
    return merchant.data.presigned_acceptance.acceptance_token;
  }

  /** Paso 3: tokeniza la tarjeta y devuelve el token */
  async tokenizeCard(dto: CreateCardTokenDto): Promise<string> {
    const resp = await this.client.tokenizeCard(dto);
    return resp.data.id;
  }

  /** Paso 4: crea el pago y devuelve la respuesta de Wompi */
  async createPayment(dto: CreatePaymentDto) {
    return this.client.createPayment(dto);
  }
}
