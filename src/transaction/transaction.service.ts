// src/modules/transaction/transaction.service.ts
import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { TransactionRepositoryPort } from './ports/transaction.repository.port';
import { CustomerRepositoryPort } from '../customer/ports/customer.repository.port';
import { DeliveryRepositoryPort } from '../delivery/ports/delivery.repository.port';
import { ProductRepositoryPort } from '../product/ports/product.repository.port';
import { Transaction } from './domain/transaction.model';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { CreateCustomerDto } from '../customer/dto/create-customer.dto';
import { CreateDeliveryDto } from '../delivery/dto/create-delivery.dto';
import { UpdateProductDto } from '../product/dto/update-product.dto';

//import { WService } from '../api/w.service';
//import { CreateCardTokenDto } from '../api/dto/create-card-token.dto';
//import { CreatePaymentDto } from '../api/dto/create-payment.dto';

@Injectable()
export class TransactionService {
  constructor(
    @Inject('TransactionRepositoryPort')
    private readonly transactionRepo: TransactionRepositoryPort,

    @Inject('CustomerRepositoryPort')
    private readonly customerRepo: CustomerRepositoryPort,

    @Inject('DeliveryRepositoryPort')
    private readonly deliveryRepo: DeliveryRepositoryPort,

    @Inject('ProductRepositoryPort')
    private readonly productRepo: ProductRepositoryPort,

    //private readonly wService: WiService,
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
   * Crea una nueva transacción y procesa el pago en api
   */
  async create(dto: CreateTransactionDto) {
    // 0) Validar y descontar stock...
    const allProducts = await this.productRepo.findAll();
    for (const item of dto.items) {
      const prod = allProducts.find(p => p.name === item.name);
      if (!prod) {
        throw new NotFoundException(`Producto "${item.name}" no encontrado`);
      }
      if (prod.stock < item.quantity) {
        throw new BadRequestException(
          `Stock insuficiente para "${item.name}". Disponible: ${prod.stock}`,
        );
      }
      await this.productRepo.update(prod.id, { stock: prod.stock - item.quantity } as UpdateProductDto);
    }

    // 1) Buscar o crear cliente
    let customer = await this.customerRepo.findByEmail(dto.customerEmail);
    if (!customer) {
      const customerDto = new CreateCustomerDto();
      customerDto.firstName = dto.firstName;
      customerDto.lastName = dto.lastName;
      customerDto.email = dto.customerEmail;
      customerDto.document = dto.document;
      customerDto.phone = dto.phone;
      customer = await this.customerRepo.create(customerDto);
    }

    // 2) Guardar en BD como pending
    const pending = await this.transactionRepo.create({
      ...dto,
      status: 'pending',
    });

    // 3) Crear la entrega asociada
    const deliveryDto = new CreateDeliveryDto();
    deliveryDto.orderId = pending.id;
    deliveryDto.address = dto.address;
    deliveryDto.scheduledDate = dto.scheduledDate;
    deliveryDto.status = 'pending';
    const delivery = await this.deliveryRepo.create(deliveryDto);

    // 2) Obtener acceptance_token
    /*const acceptanceToken = await this.wService.getAcceptanceToken();

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
      cardToken = await this.wService.tokenizeCard(cardDto);
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

    // 5) Llamar a W y manejar errores
    let resp;
    try {
      resp = await this.wService.createPayment(payDto);
    } catch (err) {
      await this.transactionRepo.update(pending.id, { status: 'cancelled' });
      throw new Error(`Error procesando pago en W: ${err.message}`);
    }

    // 6) Actualizar estado según la respuesta
    const status = resp.data.status.toLowerCase();*/
    const updated = await this.transactionRepo.update(
      pending.id,
      { status: 'completed' } as UpdateTransactionDto,
    );

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
