// test/customer/customer.module.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CustomerModule } from '../../src/customer/customer.module';
import { CustomerService } from '../../src/customer/customer.service';
import { CustomerController } from '../../src/customer/customer.controller';
import { CustomerEntity } from '../../src/customer/adapters/customer.entity';
import { CustomerRepositoryAdapter } from '../../src/customer/adapters/customer.repository.adapter';

describe('CustomerModule', () => {
    let module: TestingModule;
    let repo: Repository<CustomerEntity>;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [CustomerModule],
        })
            // Mockeamos el repositorio de TypeORM para no requerir DataSource
            .overrideProvider(getRepositoryToken(CustomerEntity))
            .useValue({} as Partial<Repository<CustomerEntity>>)
            .compile();

        repo = module.get<Repository<CustomerEntity>>(
            getRepositoryToken(CustomerEntity),
        );
    });

    it('el módulo debería compilarse', () => {
        expect(module).toBeDefined();
    });

    it('debería proveer CustomerService', () => {
        const service = module.get<CustomerService>(CustomerService);
        expect(service).toBeDefined();
    });

    it('debería proveer CustomerController', () => {
        const controller = module.get<CustomerController>(CustomerController);
        expect(controller).toBeDefined();
    });

    it('debería registrar CustomerRepositoryAdapter', () => {
        const adapter = module.get('CustomerRepositoryPort') as CustomerRepositoryAdapter
        expect(adapter).toBeDefined()
        expect(adapter).toBeInstanceOf(CustomerRepositoryAdapter)
    })

    it('debería inyectar correctamente el token de repositorio', () => {
        expect(repo).toBeDefined();
    });
});
