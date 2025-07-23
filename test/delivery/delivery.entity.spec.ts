import { DeliveryEntity } from '../../src/delivery/adapters/delivery.entity'
import { Delivery } from '../../src/delivery/domain/delivery.model'

describe('DeliveryEntity mapping', () => {
  const entitySample: DeliveryEntity = {
    id:            'd3ad6760-55cf-4c20-97ae-6eb0d9b5e0e1',
    orderId:       'tx-123',
    address:       'Calle 123',
    scheduledDate: new Date('2025-07-23T10:00:00.000Z'),
    status:        'pending',
  } as DeliveryEntity

  const domainSample = new Delivery(
    entitySample.id,
    entitySample.orderId,
    entitySample.address,
    entitySample.scheduledDate,
    'pending',
  )

  /* ------------------------------------------------------------ */
  it('toDomain(): convierte Entity ➜ Domain', () => {
    const result = DeliveryEntity.toDomain(entitySample)

    expect(result).toBeInstanceOf(Delivery)
    expect(result).toEqual(domainSample)
  })

  /* ------------------------------------------------------------ */
  it('fromDomain(): convierte Domain ➜ Entity', () => {
    const result = DeliveryEntity.fromDomain(domainSample)

    expect(result).toBeInstanceOf(DeliveryEntity)
    expect(result).toMatchObject({
      id:            domainSample.id,
      orderId:       domainSample.orderId,
      address:       domainSample.address,
      scheduledDate: domainSample.scheduledDate,
      status:        domainSample.status,
    })
  })

  /* ------------------------------------------------------------ */
  it('mantiene simetría: fromDomain(toDomain(entity)) ≅ entity', () => {
    const roundTrip = DeliveryEntity.fromDomain(
      DeliveryEntity.toDomain(entitySample),
    )

    // No comparamos instancias exactas, sino los valores de sus propiedades
    expect(roundTrip).toMatchObject(entitySample)
  })
})
