import { NotFoundException } from '@nestjs/common';
import { CustomerService } from '../../src/customer/customer.service';
import { CustomerRepositoryPort } from '../../src/customer/ports/customer.repository.port';
import { Customer } from '../../src/customer/domain/customer.model';
import { CreateCustomerDto } from '../../src/customer/dto/create-customer.dto';
import { UpdateCustomerDto } from '../../src/customer/dto/update-customer.dto';

describe('CustomerService', () => {
  let service: CustomerService;
  let repo: jest.Mocked<CustomerRepositoryPort>;

  const sampleCustomer = new Customer(
    'id-1',
    'John',
    'Doe',
    'john@example.com',
    '1234567890',
    '555-0000',
    new Date('2025-07-22T12:00:00Z'),
    undefined
  );

  beforeEach(() => {
    repo = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any;

    service = new CustomerService(repo);
  });

  it('findAll should return array of customers', async () => {
    repo.findAll.mockResolvedValue([sampleCustomer]);
    const result = await service.findAll();
    expect(repo.findAll).toHaveBeenCalled();
    expect(result).toEqual([sampleCustomer]);
  });

  describe('findById', () => {
    it('should return customer if found', async () => {
      repo.findById.mockResolvedValue(sampleCustomer);
      const result = await service.findById('id-1');
      expect(repo.findById).toHaveBeenCalledWith('id-1');
      expect(result).toEqual(sampleCustomer);
    });

    it('should throw NotFoundException if not found', async () => {
      repo.findById.mockResolvedValue(null);
      await expect(service.findById('missing')).rejects.toThrow(
        NotFoundException
      );
      expect(repo.findById).toHaveBeenCalledWith('missing');
    });
  });

  describe('create', () => {
    it('should call repo.create and return customer', async () => {
      const dto: CreateCustomerDto = {
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@example.com',
        document: '0987654321',
        phone: '555-1111',
      };
      repo.create.mockResolvedValue(sampleCustomer);
      const result = await service.create(dto);
      expect(repo.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(sampleCustomer);
    });
  });

  describe('update', () => {
    it('should update existing customer', async () => {
      const dto: UpdateCustomerDto = { phone: '555-2222' };
      repo.findById.mockResolvedValue(sampleCustomer);
      repo.update.mockResolvedValue(sampleCustomer);

      const result = await service.update('id-1', dto);
      expect(repo.findById).toHaveBeenCalledWith('id-1');
      expect(repo.update).toHaveBeenCalledWith('id-1', dto);
      expect(result).toEqual(sampleCustomer);
    });

    it('should throw NotFoundException if customer does not exist', async () => {
      const dto: UpdateCustomerDto = { phone: '555-3333' };
      repo.findById.mockResolvedValue(null);
      await expect(service.update('missing', dto)).rejects.toThrow(
        NotFoundException
      );
      expect(repo.findById).toHaveBeenCalledWith('missing');
    });
  });

  describe('delete', () => {
    it('should delete existing customer', async () => {
      repo.findById.mockResolvedValue(sampleCustomer);
      repo.delete.mockResolvedValue(undefined);
      await expect(service.delete('id-1')).resolves.toBeUndefined();
      expect(repo.findById).toHaveBeenCalledWith('id-1');
      expect(repo.delete).toHaveBeenCalledWith('id-1');
    });

    it('should throw NotFoundException when deleting non-existent customer', async () => {
      repo.findById.mockResolvedValue(null);
      await expect(service.delete('missing')).rejects.toThrow(
        NotFoundException
      );
      expect(repo.findById).toHaveBeenCalledWith('missing');
    });
  });
});
