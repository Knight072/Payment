// src/modules/transaction/ports/transaction.repository.port.ts
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { UpdateTransactionDto } from '../dto/update-transaction.dto';
import { Transaction } from '../domain/transaction.model';

/**
 * Puerto que define las operaciones de acceso a datos para transacciones
 */
export interface TransactionRepositoryPort {
  /**
   * Lista todas las transacciones
   */
  findAll(): Promise<Transaction[]>;

  /**
   * Busca una transacción por su ID. Retorna null si no existe.
   */
  findById(id: string): Promise<Transaction | null>;

  /**
   * Crea una nueva transacción a partir del DTO proporcionado
   */
  create(dto: CreateTransactionDto): Promise<Transaction>;

  /**
   * Actualiza una transacción existente identificada por ID
   */
  update(id: string, dto: UpdateTransactionDto): Promise<Transaction>;

  /**
   * Elimina la transacción identificada por ID
   */
  delete(id: string): Promise<void>;
}
