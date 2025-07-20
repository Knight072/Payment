// src/modules/transaction/adapters/typeorm/transaction.repository.adapter.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionRepositoryPort } from '../ports/transaction.repository.port';
import { TransactionEntity } from './transaction.entity';
import { Transaction } from '../domain/transaction.model';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { UpdateTransactionDto } from '../dto/update-transaction.dto';

@Injectable()
export class TransactionRepositoryAdapter implements TransactionRepositoryPort {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly repo: Repository<TransactionEntity>,
  ) {}

  async findAll(): Promise<Transaction[]> {
    const entities = await this.repo.find();
    return entities.map(TransactionEntity.toDomain);
  }

  async findById(id: string): Promise<Transaction | null> {
    const entity = await this.repo.findOne({ where: { id } });
    return entity ? TransactionEntity.toDomain(entity) : null;
  }

  async create(dto: CreateTransactionDto): Promise<Transaction> {
    const entity = this.repo.create(dto);
    const saved = await this.repo.save(entity);
    return TransactionEntity.toDomain(saved);
  }

  async update(id: string, dto: UpdateTransactionDto): Promise<Transaction> {
    await this.repo.update(id, dto);
    const updated = await this.repo.findOneOrFail({ where: { id } });
    return TransactionEntity.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}