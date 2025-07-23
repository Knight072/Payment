import 'reflect-metadata'
import { Test, TestingModule } from '@nestjs/testing'
import { NotFoundException } from '@nestjs/common'
import { DeliveryService } from '../../src/delivery/delivery.service'
import { Delivery } from '../../src/delivery/domain/delivery.model'
import { CreateDeliveryDto } from '../../src/delivery/dto/create-delivery.dto'
import { UpdateDeliveryDto } from '../../src/delivery/dto/update-delivery.dto'

/* ------------------------------------------------------------------ */
/* Mock factory para DeliveryRepositoryPort                            */
/* ------------------------------------------------------------------ */
function mockRepo() {
  return {
    findAll:  jest.fn(),
    findById: jest.fn(),
    create:   jest.fn(),
    update:   jest.fn(),
    delete:   jest.fn(),
  }
}

/* ------------------------------------------------------------------ */
/* Datos de muestra                                                    */
/* ------------------------------------------------------------------ */
const sampleDelivery = new Delivery(
  'del-1',
  'tx-123',
  'Calle 123',
  new Date('2025-07-23T10:00:00.000Z'),
  'pending',
)

/* ------------------------------------------------------------------ */
/* Test Suite                                                          */
/* ------------------------------------------------------------------ */
describe('DeliveryService', () => {
  let service: DeliveryService
  let repo: ReturnType<typeof mockRepo>

  beforeEach(async () => {
    repo = mockRepo()

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeliveryService,
        { provide: 'DeliveryRepositoryPort', useValue: repo },
      ],
    }).compile()

    service = module.get(DeliveryService)
  })

  /* ----------------------------- findAll --------------------------- */
  it('findAll() delega en repo.findAll()', async () => {
    repo.findAll.mockResolvedValue([sampleDelivery])

    const result = await service.findAll()

    expect(repo.findAll).toHaveBeenCalledTimes(1)
    expect(result).toEqual([sampleDelivery])
  })

  /* ----------------------------- findById -------------------------- */
  describe('findById()', () => {
    it('devuelve la entrega si existe', async () => {
      repo.findById.mockResolvedValue(sampleDelivery)

      const result = await service.findById(sampleDelivery.id)

      expect(repo.findById).toHaveBeenCalledWith(sampleDelivery.id)
      expect(result).toEqual(sampleDelivery)
    })

    it('lanza NotFoundException si no existe', async () => {
      repo.findById.mockResolvedValue(null)

      await expect(service.findById('no-id'))
        .rejects.toBeInstanceOf(NotFoundException)
    })
  })

  /* ----------------------------- create ---------------------------- */
  it('create() delega en repo.create()', async () => {
    const dto: CreateDeliveryDto = {
      orderId:       sampleDelivery.orderId,
      address:       sampleDelivery.address,
      scheduledDate: sampleDelivery.scheduledDate.toISOString(),
      status:        'pending',
    }

    repo.create.mockResolvedValue(sampleDelivery)

    const result = await service.create(dto)

    expect(repo.create).toHaveBeenCalledWith(dto)
    expect(result).toEqual(sampleDelivery)
  })

  /* ----------------------------- update ---------------------------- */
  it('update() valida existencia y delega en repo.update()', async () => {
    const dto: UpdateDeliveryDto = { status: 'in_transit' }

    repo.findById.mockResolvedValue(sampleDelivery)
    repo.update.mockResolvedValue(
      new Delivery(
        sampleDelivery.id,
        sampleDelivery.orderId,
        sampleDelivery.address,
        sampleDelivery.scheduledDate,
        'in_transit',
      ),
    )

    const result = await service.update(sampleDelivery.id, dto)

    expect(repo.update).toHaveBeenCalledWith(sampleDelivery.id, dto)
    expect(result.status).toBe('in_transit')
  })

  /* ----------------------------- delete ---------------------------- */
  it('delete() valida existencia y delega en repo.delete()', async () => {
    repo.findById.mockResolvedValue(sampleDelivery)
    repo.delete.mockResolvedValue(undefined)

    await service.delete(sampleDelivery.id)

    expect(repo.delete).toHaveBeenCalledWith(sampleDelivery.id)
  })
})
