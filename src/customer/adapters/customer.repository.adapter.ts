// src/modules/customer/adapters/typeorm/customer.repository.adapter.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerRepositoryPort } from '../ports/customer.repository.port';
import { CustomerEntity } from './customer.entity';
import { Customer } from '../domain/customer.model';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { UpdateCustomerDto } from '../dto/update-customer.dto';

@Injectable()
export class CustomerRepositoryAdapter implements CustomerRepositoryPort {
    constructor(
        @InjectRepository(CustomerEntity)
        private readonly repo: Repository<CustomerEntity>,
    ) { }

    async findAll(): Promise<Customer[]> {
        const entities = await this.repo.find();
        return entities.map(CustomerEntity.toDomain);
    }

    async findById(id: string): Promise<Customer | null> {
        const entity = await this.repo.findOne({ where: { id } });
        return entity ? CustomerEntity.toDomain(entity) : null;
    }

    async findByEmail(email: string): Promise<Customer | null> {
        const e = await this.repo.findOne({ where: { email } });
        return e ? CustomerEntity.toDomain(e) : null;
    }

    async create(dto: CreateCustomerDto): Promise<Customer> {
        const entity = this.repo.create(dto);
        const saved = await this.repo.save(entity);
        return CustomerEntity.toDomain(saved);
    }

    async update(id: string, dto: UpdateCustomerDto): Promise<Customer> {
        await this.repo.update(id, dto);
        const updated = await this.repo.findOneOrFail({ where: { id } });
        return CustomerEntity.toDomain(updated);
    }

    async delete(id: string): Promise<void> {
        await this.repo.delete(id);
    }
}
