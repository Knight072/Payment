// src/modules/transaction/adapters/typeorm/transaction.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Transaction } from '../domain/transaction.model';

@Entity({ name: 'transactions' })
export class TransactionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  description: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  @Column({ type: 'timestamp' })
  date: Date;

  @Column({ type: 'varchar', length: 50 })
  status: string;

  /** Convierte entidad a modelo de dominio */
  static toDomain(entity: TransactionEntity): Transaction {
    return new Transaction(
      entity.id,
      entity.description,
      Number(entity.amount),
      entity.date,
      entity.status,
    );
  }

  /** Crea entidad desde modelo de dominio */
  static fromDomain(tx: Transaction): TransactionEntity {
    const entity = new TransactionEntity();
    entity.id = tx.id;
    entity.description = tx.description;
    entity.amount = tx.amount;
    entity.date = tx.date;
    entity.status = tx.status;
    return entity;
  }
}