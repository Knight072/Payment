import { validateSync } from 'class-validator';
import { CreateCustomerDto } from '../../src/customer/dto/create-customer.dto';

describe('CreateCustomerDto Validation', () => {
  it('should validate successfully with all required fields', () => {
    const dto = new CreateCustomerDto();
    dto.firstName = 'Alice';
    dto.lastName = 'Smith';
    dto.email = 'alice@example.com';
    dto.document = '123456789';
    dto.phone = '555-1234';

    const errors = validateSync(dto);
    expect(errors.length).toBe(0);
  });

  it('should allow phone to be optional', () => {
    const dto = new CreateCustomerDto();
    dto.firstName = 'Bob';
    dto.lastName = 'Jones';
    dto.email = 'bob@example.com';
    dto.document = '987654321';
    // no phone

    const errors = validateSync(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail when firstName is empty', () => {
    const dto = new CreateCustomerDto();
    dto.firstName = '';
    dto.lastName = 'Smith';
    dto.email = 'alice@example.com';
    dto.document = '123456789';

    const errors = validateSync(dto);
    expect(errors.some(e => e.property === 'firstName')).toBeTruthy();
  });

  it('should fail when lastName is missing', () => {
    const dto = new CreateCustomerDto();
    dto.firstName = 'Alice';
    // missing lastName
    dto.email = 'alice@example.com';
    dto.document = '123456789';

    const errors = validateSync(dto);
    expect(errors.some(e => e.property === 'lastName')).toBeTruthy();
  });

  it('should fail for invalid email', () => {
    const dto = new CreateCustomerDto();
    dto.firstName = 'Alice';
    dto.lastName = 'Smith';
    dto.email = 'not-an-email';
    dto.document = '123456789';

    const errors = validateSync(dto);
    expect(errors.some(e => e.property === 'email')).toBeTruthy();
  });

  it('should fail when document is empty', () => {
    const dto = new CreateCustomerDto();
    dto.firstName = 'Alice';
    dto.lastName = 'Smith';
    dto.email = 'alice@example.com';
    dto.document = '';

    const errors = validateSync(dto);
    expect(errors.some(e => e.property === 'document')).toBeTruthy();
  });

  it('should fail when phone is not string', () => {
    const dto: any = new CreateCustomerDto();
    dto.firstName = 'Alice';
    dto.lastName = 'Smith';
    dto.email = 'alice@example.com';
    dto.document = '123456789';
    dto.phone = 12345; // invalid type

    const errors = validateSync(dto);
    expect(errors.some(e => e.property === 'phone')).toBeTruthy();
  });
});
