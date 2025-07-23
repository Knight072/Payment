import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { CustomerController } from '../../src/customer/customer.controller';
import { CustomerService } from '../../src/customer/customer.service';
import { Customer } from '../../src/customer/domain/customer.model';
import { CreateCustomerDto } from '../../src/customer/dto/create-customer.dto';
import { UpdateCustomerDto } from '../../src/customer/dto/update-customer.dto';

describe('CustomerController (unit)', () => {
    let app: INestApplication;
    let service: Partial<Record<keyof CustomerService, jest.Mock>>;

    beforeAll(async () => {
        service = {
            findAll: jest.fn().mockResolvedValue([]),
            findById: jest.fn().mockResolvedValue(null),
            create: jest.fn().mockImplementation(dto => Promise.resolve(
                new Customer('id-1', dto.firstName, dto.lastName, dto.email, dto.document, dto.phone)
            )),
            update: jest.fn().mockImplementation((id, dto) => Promise.resolve(
                new Customer(id, dto.firstName ?? 'X', dto.lastName ?? 'Y', dto.email ?? 'x@y.com', dto.document ?? 'D', dto.phone)
            )),
            delete: jest.fn().mockResolvedValue(undefined),
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [CustomerController],
            providers: [
                { provide: CustomerService, useValue: service },
            ],
        }).compile();

        app = module.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    it('GET /customers (findAll)', () => {
        return request(app.getHttpServer())
            .get('/customers')
            .expect(200)
            .expect([]);
    });

    it('GET /customers/:id (findOne) returns 200 and null when not found', () => {
        (service.findById as jest.Mock).mockResolvedValue(null);
        return request(app.getHttpServer())
            .get('/customers/id-not-exist')
            .expect(200)
            .expect(''); // null body yields empty
    });

    it('POST /customers (create)', () => {
        const dto: CreateCustomerDto = {
            firstName: 'Alice',
            lastName: 'Smith',
            email: 'alice@example.com',
            document: '12345',
            phone: '555-0000',
        };
        return request(app.getHttpServer())
            .post('/customers')
            .send(dto)
            .expect(201)
            .expect(res => {
                expect(res.body).toEqual(
                    expect.objectContaining({
                        id: 'id-1',
                        firstName: 'Alice',
                        lastName: 'Smith',
                        email: 'alice@example.com',
                        document: '12345',
                        phone: '555-0000',
                    }),
                );
            });
    });

    it('PUT /customers/:id (update)', () => {
        const dto: UpdateCustomerDto = { phone: '555-1111' };
        return request(app.getHttpServer())
            .put('/customers/id-1')
            .send(dto)
            .expect(200)
            .expect(res => {
                expect(res.body).toEqual(
                    expect.objectContaining({
                        id: 'id-1',
                        phone: '555-1111',
                    }),
                );
            });
    });

    it('DELETE /customers/:id (remove)', () => {
        return request(app.getHttpServer())
            .delete('/customers/id-1')
            .expect(204)
            .expect('');
    });
});
