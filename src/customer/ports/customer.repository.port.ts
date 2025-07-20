// src/modules/customer/ports/customer.repository.port.ts
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { UpdateCustomerDto } from '../dto/update-customer.dto';
import { Customer } from '../domain/customer.model';

/**
 * Puerto que define las operaciones de acceso a datos para clientes
 */
export interface CustomerRepositoryPort {
  /**
   * Lista todos los clientes
   */
  findAll(): Promise<Customer[]>;

  /**
   * Busca un cliente por su ID. Retorna null si no existe.
   */
  findById(id: string): Promise<Customer | null>;

  /**
   * Crea un nuevo cliente a partir del DTO proporcionado
   */
  create(dto: CreateCustomerDto): Promise<Customer>;

  /**
   * Actualiza un cliente existente identificado por ID
   */
  update(id: string, dto: UpdateCustomerDto): Promise<Customer>;

  /**
   * Elimina el cliente identificado por ID
   */
  delete(id: string): Promise<void>;
}
