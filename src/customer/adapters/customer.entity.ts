// src/modules/customer/adapters/typeorm/customer.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Customer } from '../domain/customer.model';

@Entity({ name: 'customers' })
export class CustomerEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  firstName: string;

  @Column({ type: 'varchar', length: 100 })
  lastName: string;

  @Column({ type: 'varchar', length: 200, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  document: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone?: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updatedAt?: Date;

  /** Mapea la entidad al modelo de dominio */
  static toDomain(entity: CustomerEntity): Customer {
    return new Customer(
      entity.id,
      entity.firstName,
      entity.lastName,
      entity.email,
      entity.document,
      entity.phone,
      entity.createdAt,
      entity.updatedAt,
    );
  }

  /** Crea la entidad a partir del modelo de dominio */
  static fromDomain(customer: Customer): CustomerEntity {
    const entity = new CustomerEntity();
    entity.id = customer.id;
    entity.firstName = customer.firstName;
    entity.lastName = customer.lastName;
    entity.email = customer.email;
    entity.document = customer.document;
    entity.phone = customer.phone;
    entity.createdAt = customer.createdAt;
    entity.updatedAt = customer.updatedAt;
    return entity;
  }
}