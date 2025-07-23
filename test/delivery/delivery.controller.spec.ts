import 'reflect-metadata'
import { Test, TestingModule } from '@nestjs/testing'
import { DeliveryController } from '../../src/delivery/delivery.controller'
import { DeliveryService } from '../../src/delivery/delivery.service'
import { Delivery } from '../../src/delivery/domain/delivery.model'
import { CreateDeliveryDto } from '../../src/delivery/dto/create-delivery.dto'
import { UpdateDeliveryDto } from '../../src/delivery/dto/update-delivery.dto'

describe('DeliveryController', () => {
  let controller: DeliveryController
  let service:    jest.Mocked<DeliveryService>

  /* ---------------- mock factory para DeliveryService --------- */
  const serviceMockFactory = (): jest.Mocked<DeliveryService> => ({
    findAll: jest.fn(),
    findById: jest.fn(),
    create:   jest.fn(),
    update:   jest.fn(),
    delete:   jest.fn(),
  } as unknown as jest.Mocked<DeliveryService>)

  /* ---------------- objeto de ejemplo ------------------------- */
  const sampleDelivery = new Delivery(
    'del-1',
    'tx-123',
    'Calle 123',
    new Date('2025-07-23T10:00:00.000Z'),
    'pending',
  )

  /* ---------------- configuración del TestingModule ----------- */
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeliveryController],
      providers:   [{ provide: DeliveryService, useFactory: serviceMockFactory }],
    }).compile()

    controller = module.get(DeliveryController)
    service    = module.get(DeliveryService)
  })

  /* ------------------- findAll -------------------------------- */
  it('findAll() delega en service.findAll()', async () => {
    service.findAll.mockResolvedValue([sampleDelivery])

    const result = await controller.findAll()

    expect(service.findAll).toHaveBeenCalledTimes(1)
    expect(result).toEqual([sampleDelivery])
  })

  /* ------------------- findOne ------------------------------- */
  it('findOne() delega en service.findById()', async () => {
    service.findById.mockResolvedValue(sampleDelivery)

    const result = await controller.findOne(sampleDelivery.id)

    expect(service.findById).toHaveBeenCalledWith(sampleDelivery.id)
    expect(result).toEqual(sampleDelivery)
  })

  /* ------------------- create -------------------------------- */
  it('create() delega en service.create()', async () => {
    const dto: CreateDeliveryDto = {
      orderId:       sampleDelivery.orderId,
      address:       sampleDelivery.address,
      scheduledDate: sampleDelivery.scheduledDate.toISOString(),
      status:        'pending',
    }

    service.create.mockResolvedValue(sampleDelivery)

    const result = await controller.create(dto)

    expect(service.create).toHaveBeenCalledWith(dto)
    expect(result).toEqual(sampleDelivery)
  })

  /* ------------------- update -------------------------------- */
  it('update() delega en service.update()', async () => {
    const dto: UpdateDeliveryDto = { status: 'in_transit' }

    service.update.mockResolvedValue(
      new Delivery(
        sampleDelivery.id,
        sampleDelivery.orderId,
        sampleDelivery.address,
        sampleDelivery.scheduledDate,
        'in_transit',
      ),
    )

    const result = await controller.update(sampleDelivery.id, dto)

    expect(service.update).toHaveBeenCalledWith(sampleDelivery.id, dto)
    expect(result.status).toBe('in_transit')
  })

  /* ------------------- delete -------------------------------- */
  it('remove() delega en service.delete() y devuelve void', async () => {
    service.delete.mockResolvedValue(undefined)

    await expect(controller.remove(sampleDelivery.id)).resolves.toBeUndefined()
    expect(service.delete).toHaveBeenCalledWith(sampleDelivery.id)
  })
})
