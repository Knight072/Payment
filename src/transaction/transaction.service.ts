// src/modules/transaction/transaction.service.ts
import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { TransactionRepositoryPort } from './ports/transaction.repository.port';
import { Transaction }               from './domain/transaction.model';
import { CreateTransactionDto }      from './dto/create-transaction.dto';
import { UpdateTransactionDto }      from './dto/update-transaction.dto';

import { WompiService }              from '../wompi/wompi.service';
import { CreateCardTokenDto }        from '../wompi/dto/create-card-token.dto';
import { CreatePaymentDto }          from '../wompi/dto/create-payment.dto';

@Injectable()
export class TransactionService {
  constructor(
    @Inject('TransactionRepositoryPort')
    private readonly transactionRepo: TransactionRepositoryPort,

    private readonly wompiService: WompiService,
  ) {}

  /**
   * Lista todas las transacciones
   */
  async findAll(): Promise<Transaction[]> {
    return this.transactionRepo.findAll();
  }

  /**
   * Obtiene una transacción por ID
   */
  async findById(id: string): Promise<Transaction> {
    const tx = await this.transactionRepo.findById(id);
    if (!tx) {
      throw new NotFoundException(`Transacción con id ${id} no encontrada`);
    }
    return tx;
  }

  /**
   * Crea una nueva transacción y procesa el pago en Wompi
   */
  async create(dto: CreateTransactionDto): Promise<Transaction> {
    const pending = await this.transactionRepo.create({
      ...dto,
      status: 'pending',
    });

    const acceptanceToken = await this.wompiService.getAcceptanceToken();

    // 3) Tokenizar la tarjeta si no viene un cardToken en el DTO
    let cardToken: string;
    if (dto.cardToken) {
      cardToken = dto.cardToken;
    } else {
      const cardDto: CreateCardTokenDto = {
        number:     dto.cardNumber!,
        cvc:        dto.cardCvc!,
        exp_month:  dto.cardExpMonth!,
        exp_year:   dto.cardExpYear!,
        card_holder:dto.customerEmail!,
      };
      cardToken = await this.wompiService.tokenizeCard(cardDto);
    }

    // 4) Preparar el DTO para crear el pago en Wompi
    const payDto: CreatePaymentDto = {
      acceptance_token:     acceptanceToken,
      amount_in_cents:      Math.round(dto.amount * 100),
      currency:             'COP',
      customer_email:       dto.customerEmail,
      reference:            pending.id,
      payment_method: {
        type:  'CARD',
        token: cardToken,
      },
    };

    // 5) Llamar a Wompi para procesar el pago
    const resp = await this.wompiService.createPayment(payDto);

    // 6) Actualizar el estado de la transacción según la respuesta
    pending.status = resp.data.status.toLowerCase();
    const updated = await this.transactionRepo.update(pending.id, {
      status: pending.status,
    } as UpdateTransactionDto);

    return updated;
  }

  /**
   * Actualiza una transacción existente
   */
  async update(id: string, dto: UpdateTransactionDto): Promise<Transaction> {
    await this.findById(id);
    return this.transactionRepo.update(id, dto);
  }

  /**
   * Elimina una transacción
   */
  async delete(id: string): Promise<void> {
    await this.findById(id);
    return this.transactionRepo.delete(id);
  }
}
