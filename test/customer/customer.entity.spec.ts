import { CustomerEntity } from '../../src/customer/adapters/customer.entity';
import { Customer } from '../../src/customer/domain/customer.model';

describe('CustomerEntity', () => {
  const id = 'b91d87b0-11f0-4eec-8e40-f057e57254c7';
  const firstName = 'Daniel';
  const lastName = 'Gómez';
  const email = 'daniel@gmail.com';
  const document = '1023456789';
  const phone = '3015608604';
  const createdAt = new Date('2025-07-22T18:00:00Z');
  const updatedAt = new Date('2025-07-23T10:00:00Z');

  it('debería mapear una CustomerEntity a Customer (toDomain)', () => {
    // Preparar la entidad
    const entity = new CustomerEntity();
    entity.id = id;
    entity.firstName = firstName;
    entity.lastName = lastName;
    entity.email = email;
    entity.document = document;
    entity.phone = phone;
    entity.createdAt = createdAt;
    entity.updatedAt = updatedAt;

    // Ejecutar toDomain
    const domain = CustomerEntity.toDomain(entity);

    // Verificar que todos los campos coincidan
    expect(domain).toBeInstanceOf(Customer);
    expect(domain.id).toBe(id);
    expect(domain.firstName).toBe(firstName);
    expect(domain.lastName).toBe(lastName);
    expect(domain.email).toBe(email);
    expect(domain.document).toBe(document);
    expect(domain.phone).toBe(phone);
    expect(domain.createdAt).toEqual(createdAt);
    expect(domain.updatedAt).toEqual(updatedAt);
  });

  it('debería mapear un Customer a CustomerEntity (fromDomain)', () => {
    // Preparar el modelo de dominio
    const domain = new Customer(
      id,
      firstName,
      lastName,
      email,
      document,
      phone,
      createdAt,
      updatedAt,
    );

    // Ejecutar fromDomain
    const entity = CustomerEntity.fromDomain(domain);

    // Verificar que todos los campos coincidan
    expect(entity).toBeInstanceOf(CustomerEntity);
    expect(entity.id).toBe(id);
    expect(entity.firstName).toBe(firstName);
    expect(entity.lastName).toBe(lastName);
    expect(entity.email).toBe(email);
    expect(entity.document).toBe(document);
    expect(entity.phone).toBe(phone);
    expect(entity.createdAt).toEqual(createdAt);
    expect(entity.updatedAt).toEqual(updatedAt);
  });
});
