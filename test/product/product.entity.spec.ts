import { ProductEntity } from '../../src/product/adapters/product.entity'
import { Product } from '../../src/product/domain/product.model'

describe('ProductEntity mapping', () => {
  const entitySample: ProductEntity = {
    id:          'f88f7d0e-793b-4902-b3bb-d2b7d2f4e123',
    name:        'Taza W',
    description: 'Taza mágica color negro',
    price:       25000,
    stock:       5,
  } as ProductEntity

  const domainSample = new Product(
    entitySample.id,
    entitySample.name,
    entitySample.description,
    entitySample.price,
    entitySample.stock,
  )

  it('toDomain(): convierte correctamente Entity ➜ Domain', () => {
    const result = ProductEntity.toDomain(entitySample)

    expect(result).toBeInstanceOf(Product)
    expect(result).toEqual(domainSample)
  })

  it('fromDomain(): convierte correctamente Domain ➜ Entity', () => {
    const result = ProductEntity.fromDomain(domainSample)

    expect(result).toBeInstanceOf(ProductEntity)
    expect(result).toMatchObject({
      id:          domainSample.id,
      name:        domainSample.name,
      description: domainSample.description,
      price:       domainSample.price,
      stock:       domainSample.stock,
    })
  })

  it('mantiene simetría: fromDomain(toDomain(entity)) ≅ entity', () => {
    const roundTrip = ProductEntity.fromDomain(
      ProductEntity.toDomain(entitySample),
    )
    expect(roundTrip).toMatchObject(entitySample)
  })
})
