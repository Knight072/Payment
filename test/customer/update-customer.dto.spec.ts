import { validateSync } from 'class-validator';
import { UpdateCustomerDto } from '../../src/customer/dto/update-customer.dto';

describe('UpdateCustomerDto Validation', () => {
  it('should validate successfully when no fields provided (all optional)', () => {
    const dto = new UpdateCustomerDto();
    const errors = validateSync(dto);
    expect(errors.length).toBe(0);
  });

  it('should validate successfully when only firstName is provided', () => {
    const dto = new UpdateCustomerDto();
    dto.firstName = 'Alice';
    const errors = validateSync(dto);
    expect(errors.length).toBe(0);
  });

  it('should validate successfully when only lastName is provided', () => {
    const dto = new UpdateCustomerDto();
    dto.lastName = 'Smith';
    const errors = validateSync(dto);
    expect(errors.length).toBe(0);
  });

  it('should validate successfully with valid email', () => {
    const dto = new UpdateCustomerDto();
    dto.email = 'valid@example.com';
    const errors = validateSync(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail when email is invalid', () => {
    const dto = new UpdateCustomerDto();
    dto.email = 'not-an-email';
    const errors = validateSync(dto);
    expect(errors.some(e => e.property === 'email')).toBeTruthy();
  });

  it('should fail when firstName is empty string', () => {
    const dto = new UpdateCustomerDto();
    dto.firstName = '';
    const errors = validateSync(dto);
    expect(errors.some(e => e.property === 'firstName')).toBeTruthy();
  });

  it('should fail when document is empty string', () => {
    const dto = new UpdateCustomerDto();
    dto.document = '';
    const errors = validateSync(dto);
    expect(errors.some(e => e.property === 'document')).toBeTruthy();
  });

  it('should fail when phone is wrong type', () => {
    const dto: any = new UpdateCustomerDto();
    dto.phone = 12345;
    const errors = validateSync(dto);
    expect(errors.some(e => e.property === 'phone')).toBeTruthy();
  });
});
