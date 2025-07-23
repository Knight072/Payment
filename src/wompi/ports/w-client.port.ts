// src/modules/api/ports/w-client.port.ts
import { CreateCardTokenDto }   from '../dto/create-card-token.dto';
import { CardTokenResponse }    from '../dto/card-token-response.dto';
import { CreatePaymentDto }     from '../dto/create-payment.dto';
import { PaymentResponse }      from '../dto/payment-response.dto';

export abstract class WClientPort {
  abstract getMerchant(publicKey: string): Promise<any>;

  abstract tokenizeCard(dto: CreateCardTokenDto): Promise<CardTokenResponse>;

  abstract createPayment(dto: CreatePaymentDto): Promise<PaymentResponse>;
}
