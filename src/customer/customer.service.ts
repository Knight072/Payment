// src/modules/customer/customer.service.ts
import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { CustomerRepositoryPort } from './ports/customer.repository.port';
import { Customer } from './domain/customer.model';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomerService {
    constructor(
        @Inject('CustomerRepositoryPort')
        private readonly customerRepo: CustomerRepositoryPort,
    ) { }

    /**
     * Lista todos los clientes
     */
    async findAll(): Promise<Customer[]> {
        return this.customerRepo.findAll();
    }

    /**
     * Obtiene un cliente por ID
     */
    async findById(id: string): Promise<Customer> {
        const customer = await this.customerRepo.findById(id);
        if (!customer) {
            throw new NotFoundException(`Cliente con id ${id} no encontrado`);
        }
        return customer;
    }

    /**
     * Crea un nuevo cliente
     */
    async create(dto: CreateCustomerDto): Promise<Customer> {
        return this.customerRepo.create(dto);
    }

    /**
     * Actualiza un cliente existente
     */
    async update(id: string, dto: UpdateCustomerDto): Promise<Customer> {
        await this.findById(id);
        return this.customerRepo.update(id, dto);
    }

    /**
     * Elimina un cliente
     */
    async delete(id: string): Promise<void> {
        await this.findById(id);
        return this.customerRepo.delete(id);
    }
}
