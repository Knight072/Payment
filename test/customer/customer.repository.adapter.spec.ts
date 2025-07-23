// src/modules/customer/adapters/typeorm/customer.repository.adapter.spec.ts

import { CustomerRepositoryAdapter } from '../../src/customer/adapters/customer.repository.adapter';
import { CustomerEntity } from '../../src/customer/adapters/customer.entity';
import { Customer } from '../../src/customer/domain/customer.model';
import { Repository } from 'typeorm';
import { CreateCustomerDto } from '../../src/customer/dto/create-customer.dto';
import { UpdateCustomerDto } from '../../src/customer/dto/update-customer.dto';

// Helper para simular el repositorio de TypeORM
function createMockRepository(): jest.Mocked<Repository<CustomerEntity>> {
    return {
        find: jest.fn(),
        findOne: jest.fn(),
        findOneOrFail: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    } as any;
}

describe('CustomerRepositoryAdapter', () => {
    let adapter: CustomerRepositoryAdapter;
    let repo: ReturnType<typeof createMockRepository>;

    const sampleEntity: CustomerEntity = {
        id: 'uuid-1234',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        document: '1234567890',
        phone: '555-0100',
        createdAt: new Date('2025-01-01T00:00:00Z'),
        updatedAt: new Date('2025-01-02T00:00:00Z'),
    } as CustomerEntity;

    const sampleDomain = new Customer(
        sampleEntity.id,
        sampleEntity.firstName,
        sampleEntity.lastName,
        sampleEntity.email,
        sampleEntity.document,
        sampleEntity.phone,
        sampleEntity.createdAt,
        sampleEntity.updatedAt,
    );

    beforeEach(() => {
        repo = createMockRepository();
        adapter = new CustomerRepositoryAdapter(repo);
    });

    it('findAll deberí­a retornar lista de Customer', async () => {
        repo.find.mockResolvedValue([sampleEntity]);
        const result = await adapter.findAll();
        expect(repo.find).toHaveBeenCalled();
        expect(result).toEqual([sampleDomain]);
    });

    it('findById retorna Customer si existe', async () => {
        repo.findOne.mockResolvedValue(sampleEntity);
        const result = await adapter.findById('uuid-1234');
        expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 'uuid-1234' } });
        expect(result).toEqual(sampleDomain);
    });

    it('findById retorna null si no existe', async () => {
        repo.findOne.mockResolvedValue(null);
        const result = await adapter.findById('missing');
        expect(result).toBeNull();
    });

    it('findByEmail retorna Customer si existe', async () => {
        repo.findOne.mockResolvedValue(sampleEntity);
        const result = await adapter.findByEmail('john@example.com');
        expect(repo.findOne).toHaveBeenCalledWith({ where: { email: 'john@example.com' } });
        expect(result).toEqual(sampleDomain);
    });

    it('findByEmail retorna null si no existe', async () => {
        repo.findOne.mockResolvedValue(null);
        const result = await adapter.findByEmail('missing@example.com');
        expect(result).toBeNull();
    });

    it('create debe persistir y retornar Customer', async () => {
        const dto: CreateCustomerDto = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            document: '1234567890',
            phone: '555-0100',
        };
        repo.create.mockReturnValue(sampleEntity);
        repo.save.mockResolvedValue(sampleEntity);

        const result = await adapter.create(dto);
        expect(repo.create).toHaveBeenCalledWith(dto);
        expect(repo.save).toHaveBeenCalledWith(sampleEntity);
        expect(result).toEqual(sampleDomain);
    });

    it('update debe aplicar cambios y retornar Customer actualizado', async () => {
        const dto: UpdateCustomerDto = { phone: '555-0200' };
        repo.update.mockResolvedValue({} as import('typeorm').UpdateResult);
        const updatedEntity = { ...sampleEntity, phone: '555-0200' } as CustomerEntity;
        repo.findOneOrFail.mockResolvedValue(updatedEntity);

        const result = await adapter.update('uuid-1234', dto);
        expect(repo.update).toHaveBeenCalledWith('uuid-1234', dto);
        expect(repo.findOneOrFail).toHaveBeenCalledWith({ where: { id: 'uuid-1234' } });
        expect(result).toEqual(new Customer(
            updatedEntity.id,
            updatedEntity.firstName,
            updatedEntity.lastName,
            updatedEntity.email,
            updatedEntity.document,
            updatedEntity.phone,
            updatedEntity.createdAt,
            updatedEntity.updatedAt,
        ));
    });

    it('delete debe llamar a repo.delete con el id', async () => {
        // Simular DeleteResult vacío
        repo.delete.mockResolvedValue({} as import('typeorm').DeleteResult);
        await adapter.delete('uuid-1234');
        expect(repo.delete).toHaveBeenCalledWith('uuid-1234');
    });
});
