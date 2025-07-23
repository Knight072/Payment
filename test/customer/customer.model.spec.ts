import { Customer } from '../../src/customer/domain/customer.model';

describe('Customer Domain Model', () => {
  const id = 'abc123';
  const firstName = 'Alice';
  const lastName = 'Smith';
  const email = 'alice@example.com';
  const document = '987654321';
  const phone = '555-1234';
  let createdAt: Date;

  beforeEach(() => {
    // Freeze time for reproducible tests
    jest.useFakeTimers();
    const now = new Date('2025-07-22T12:00:00Z');
    jest.setSystemTime(now);
    createdAt = new Date(now);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('constructor should initialize all properties', () => {
    const customer = new Customer(
      id,
      firstName,
      lastName,
      email,
      document,
      phone,
      createdAt
    );

    expect(customer.id).toBe(id);
    expect(customer.firstName).toBe(firstName);
    expect(customer.lastName).toBe(lastName);
    expect(customer.email).toBe(email);
    expect(customer.document).toBe(document);
    expect(customer.phone).toBe(phone);
    expect(customer.createdAt).toEqual(createdAt);
    expect(customer.updatedAt).toBeUndefined();
  });

  it('updateEmail should change email and set updatedAt', () => {
    const customer = new Customer(
      id,
      firstName,
      lastName,
      email,
      document,
      phone,
      createdAt
    );

    // Advance time by 1 hour
    const newTime = new Date(createdAt.getTime() + 3600 * 1000);
    jest.setSystemTime(newTime);

    const newEmail = 'newalice@example.com';
    customer.updateEmail(newEmail);

    expect(customer.email).toBe(newEmail);
    expect(customer.updatedAt).toEqual(newTime);
  });

  it('updateName should change firstName, lastName and set updatedAt', () => {
    const customer = new Customer(
      id,
      firstName,
      lastName,
      email,
      document,
      phone,
      createdAt
    );

    // Advance time by 2 hours
    const newTime = new Date(createdAt.getTime() + 2 * 3600 * 1000);
    jest.setSystemTime(newTime);

    const newFirst = 'Bob';
    const newLast = 'Johnson';
    customer.updateName(newFirst, newLast);

    expect(customer.firstName).toBe(newFirst);
    expect(customer.lastName).toBe(newLast);
    expect(customer.updatedAt).toEqual(newTime);
  });

  it('updatePhone should change phone and set updatedAt', () => {
    const customer = new Customer(
      id,
      firstName,
      lastName,
      email,
      document,
      phone,
      createdAt
    );

    // Advance time by 30 minutes
    const newTime = new Date(createdAt.getTime() + 30 * 60 * 1000);
    jest.setSystemTime(newTime);

    const newPhone = '555-6789';
    customer.updatePhone(newPhone);

    expect(customer.phone).toBe(newPhone);
    expect(customer.updatedAt).toEqual(newTime);
  });

  it('multiple updates should cascade updatedAt changes', () => {
    const customer = new Customer(
      id,
      firstName,
      lastName,
      email,
      document,
      phone,
      createdAt
    );

    // 1st update: email
    const t1 = new Date(createdAt.getTime() + 1000);
    jest.setSystemTime(t1);
    customer.updateEmail('first@example.com');
    expect(customer.updatedAt).toEqual(t1);

    // 2nd update: name
    const t2 = new Date(t1.getTime() + 2000);
    jest.setSystemTime(t2);
    customer.updateName('Charlie', 'Brown');
    expect(customer.updatedAt).toEqual(t2);

    // 3rd update: phone
    const t3 = new Date(t2.getTime() + 3000);
    jest.setSystemTime(t3);
    customer.updatePhone('555-0000');
    expect(customer.updatedAt).toEqual(t3);
  });
});