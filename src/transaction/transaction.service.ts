// src/modules/transaction/transaction.service.ts
import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { TransactionRepositoryPort } from './ports/transaction.repository.port';
import { Transaction } from './domain/transaction.model';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

import { WompiService } from '../wompi/wompi.service';
import { CreateCardTokenDto } from '../wompi/dto/create-card-token.dto';
import { CreatePaymentDto } from '../wompi/dto/create-payment.dto';

@Injectable()
export class TransactionService {
  constructor(
    @Inject('TransactionRepositoryPort')
    private readonly transactionRepo: TransactionRepositoryPort,

    private readonly wompiService: WompiService,
  ) { }

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
  async create(dto: CreateTransactionDto) {
    // 1) Guardar en BD como pending
    const pending = await this.transactionRepo.create({
      ...dto,
      status: 'pending',
    });

    // 2) Obtener acceptance_token
    const acceptanceToken = await this.wompiService.getAcceptanceToken();

    // 3) Tokenizar tarjeta si no viene cardToken
    let cardToken = dto.cardToken;
    if (!cardToken) {
      const cardDto: CreateCardTokenDto = {
        number: dto.cardNumber!,
        cvv: dto.cardCvc!,
        exp_month: dto.cardExpMonth!,
        exp_year: dto.cardExpYear!,
        card_holder: dto.customerEmail,
      };
      cardToken = await this.wompiService.tokenizeCard(cardDto);
    }

    // 4) Preparar DTO de pago
    const payDto: CreatePaymentDto = {
      acceptance_token: acceptanceToken,
      amount_in_cents: Math.round(dto.amount * 100),
      currency: 'COP',
      customer_email: dto.customerEmail,
      reference: pending.id,
      payment_method: {
        type: 'CARD',
        token: cardToken,
      },
    };

    // 5) Llamar a Wompi y manejar errores
    let resp;
    try {
      resp = await this.wompiService.createPayment(payDto);
    } catch (err) {
      await this.transactionRepo.update(pending.id, { status: 'cancelled' });
      throw new Error(`Error procesando pago en Wompi: ${err.message}`);
    }

    // 6) Actualizar estado según la respuesta
    const status = resp.data.status.toLowerCase();
    return this.transactionRepo.update(
      pending.id,
      { status } as UpdateTransactionDto,
    );
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
