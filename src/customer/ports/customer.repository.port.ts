// src/modules/customer/ports/customer.repository.port.ts
import { Customer } from '../domain/customer.model';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { UpdateCustomerDto } from '../dto/update-customer.dto';

export interface CustomerRepositoryPort {
  findAll(): Promise<Customer[]>;
  findById(id: string): Promise<Customer | null>;
  findByEmail(email: string): Promise<Customer | null>;    // ← nuevo
  create(dto: CreateCustomerDto): Promise<Customer>;
  update(id: string, dto: UpdateCustomerDto): Promise<Customer>;
  delete(id: string): Promise<void>;
}
