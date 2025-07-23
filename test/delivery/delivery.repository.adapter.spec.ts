import 'reflect-metadata'
import { Repository } from 'typeorm'
import { DeliveryRepositoryAdapter } from '../../src/delivery/adapters/delivery.repository.adapter'
import { DeliveryEntity } from '../../src/delivery/adapters/delivery.entity'
import { Delivery } from '../../src/delivery/domain/delivery.model'
import { CreateDeliveryDto } from '../../src/delivery/dto/create-delivery.dto'
import { UpdateDeliveryDto } from '../../src/delivery/dto/update-delivery.dto'

function makeRepoMock(): jest.Mocked<Repository<DeliveryEntity>> {
  return {
    find:           jest.fn(),
    findOne:        jest.fn(),
    findOneOrFail:  jest.fn(),
    create:         jest.fn(),
    save:           jest.fn(),
    update:         jest.fn(),
    delete:         jest.fn(),
  } as unknown as jest.Mocked<Repository<DeliveryEntity>>
}

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
  entitySample.status as 'pending',
)

/* ------------------------------------------------------------------ */
/* test suite                                                          */
/* ------------------------------------------------------------------ */
describe('DeliveryRepositoryAdapter', () => {
  let repoMock: jest.Mocked<Repository<DeliveryEntity>>
  let adapter:  DeliveryRepositoryAdapter

  beforeEach(() => {
    repoMock = makeRepoMock()
    adapter  = new DeliveryRepositoryAdapter(repoMock)
  })

  /* -------------------------------------------------------------- */
  it('findAll(): mapea entidades a dominio', async () => {
    repoMock.find.mockResolvedValue([entitySample])

    const result = await adapter.findAll()

    expect(repoMock.find).toHaveBeenCalledTimes(1)
    expect(result).toEqual([domainSample])
  })

  /* -------------------------------------------------------------- */
  it('findById(): devuelve null si no existe', async () => {
    repoMock.findOne.mockResolvedValue(null)

    const result = await adapter.findById('no-id')

    expect(repoMock.findOne).toHaveBeenCalledWith({ where: { id: 'no-id' } })
    expect(result).toBeNull()
  })

  it('findById(): devuelve dominio si existe', async () => {
    repoMock.findOne.mockResolvedValue(entitySample)

    const result = await adapter.findById(entitySample.id)

    expect(result).toEqual(domainSample)
  })

  /* -------------------------------------------------------------- */
  it('create(): delega en repo.create + save', async () => {
    const dto: CreateDeliveryDto = {
      orderId:       entitySample.orderId,
      address:       entitySample.address,
      scheduledDate: entitySample.scheduledDate.toISOString(),
      status:        'pending',
    }

    repoMock.create.mockReturnValue(entitySample)
    repoMock.save.mockResolvedValue(entitySample)

    const result = await adapter.create(dto)

    expect(repoMock.create).toHaveBeenCalledWith(dto)
    expect(repoMock.save).toHaveBeenCalledWith(entitySample)
    expect(result).toEqual(domainSample)
  })

  /* -------------------------------------------------------------- */
  it('update(): llama update + findOneOrFail y devuelve dominio', async () => {
    const dto: UpdateDeliveryDto = { status: 'in_transit' }

    repoMock.update.mockResolvedValue({} as any)
    repoMock.findOneOrFail.mockResolvedValue({ ...entitySample, status: 'in_transit' })

    const result = await adapter.update(entitySample.id, dto)

    expect(repoMock.update).toHaveBeenCalledWith(entitySample.id, dto)
    expect(repoMock.findOneOrFail).toHaveBeenCalledWith({ where: { id: entitySample.id } })
    expect(result.status).toBe('in_transit')
  })

  /* -------------------------------------------------------------- */
  it('delete(): delega en repo.delete', async () => {
    repoMock.delete.mockResolvedValue({} as any)

    await adapter.delete(entitySample.id)

    expect(repoMock.delete).toHaveBeenCalledWith(entitySample.id)
  })
})
