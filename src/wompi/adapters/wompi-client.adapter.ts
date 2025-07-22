// src/modules/wompi/adapters/wompi-client.adapter.ts
import { Injectable }     from '@nestjs/common';
import { HttpService }    from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

import { WompiClientPort }      from '../ports/wompi-client.port';
import { CreateCardTokenDto }   from '../dto/create-card-token.dto';
import { CardTokenResponse }    from '../dto/card-token-response.dto';
import { CreatePaymentDto }     from '../dto/create-payment.dto';
import { PaymentResponse }      from '../dto/payment-response.dto';

@Injectable()
export class WompiClientAdapter implements WompiClientPort {
  constructor(private readonly http: HttpService) {}

  async getMerchant(publicKey: string): Promise<any> {
    const resp$ = this.http.get(`/merchants/${publicKey}`);
    const { data } = await firstValueFrom(resp$);
    return data;
  }

  async tokenizeCard(dto: CreateCardTokenDto): Promise<CardTokenResponse> {
    const resp$ = this.http.post<CardTokenResponse>('/tokens/cards', dto);
    const { data } = await firstValueFrom(resp$);
    return data;
  }

  async createPayment(dto: CreatePaymentDto): Promise<PaymentResponse> {
    const resp$ = this.http.post<PaymentResponse>('/transactions', dto);
    const { data } = await firstValueFrom(resp$);
    return data;
  }
}
