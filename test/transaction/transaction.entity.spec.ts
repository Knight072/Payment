import { Transaction } from '../../src/transaction/domain/transaction.model';
import { TransactionEntity } from '../../src/transaction/adapters/transaction.entity';

describe('TransactionEntity mapping', () => {
  const mockDate = new Date('2025-07-22T19:29:02.591Z')

  const entitySample: TransactionEntity = {
    id: 'cb8ce749-1a69-470c-9f4c-0b1e1bea4e2c',
    description: 'Taza Wompi×1',
    amount: 32000,
    date: mockDate,
    status: 'completed',
  } as TransactionEntity

  const domainSample = new Transaction(
    entitySample.id,
    entitySample.description,
    entitySample.amount,
    entitySample.date,
    entitySample.status,
  )

  it('toDomain() convierte correctamente Entity ➜ Domain', () => {
    const result = TransactionEntity.toDomain(entitySample)

    expect(result).toBeInstanceOf(Transaction)
    expect(result).toEqual(domainSample)
  })

  it('fromDomain() convierte correctamente Domain ➜ Entity', () => {
    const result = TransactionEntity.fromDomain(domainSample)

    expect(result).toBeInstanceOf(TransactionEntity)
    // Comparamos campo por campo porque result es un objeto nuevo
    expect(result).toMatchObject({
      id: domainSample.id,
      description: domainSample.description,
      amount: domainSample.amount,
      date: domainSample.date,
      status: domainSample.status,
    })
  })

  it('mantiene simetría: fromDomain(toDomain(entity)) ≅ entity', () => {
    const roundTrip = TransactionEntity.fromDomain(
      TransactionEntity.toDomain(entitySample),
    )
    expect(roundTrip).toMatchObject(entitySample)
  })
})
