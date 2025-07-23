import 'reflect-metadata'                      // Necesario para class‑validator
import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import { CreateDeliveryDto } from '../../src/delivery/dto/create-delivery.dto'

describe('CreateDeliveryDto', () => {
  const base: CreateDeliveryDto = {
    orderId:       'd3ad6760-55cf-4c20-97ae-6eb0d9b5e0e1',
    address:       'Cra 7 #45‑67',
    scheduledDate: '2025-07-23T10:00:00.000Z',
    status:        'pending',
  }

  it('acepta un payload válido', async () => {
    const dto  = plainToInstance(CreateDeliveryDto, base)
    const errs = await validate(dto)
    expect(errs.length).toBe(0)
  })

  it('falla si orderId no es UUID', async () => {
    const dto  = plainToInstance(CreateDeliveryDto, { ...base, orderId: '123' })
    const errs = await validate(dto)
    expect(errs.some(e => e.property === 'orderId')).toBe(true)
  })

  it('falla si status no está en el union', async () => {
    const dto  = plainToInstance(CreateDeliveryDto, { ...base, status: 'foo' })
    const errs = await validate(dto)
    expect(errs.some(e => e.property === 'status')).toBe(true)
  })

  it('falla si scheduledDate no es ISO', async () => {
    const dto  = plainToInstance(CreateDeliveryDto, { ...base, scheduledDate: 'hoy' })
    const errs = await validate(dto)
    expect(errs.some(e => e.property === 'scheduledDate')).toBe(true)
  })

  it('falla si address está vacío', async () => {
    const dto  = plainToInstance(CreateDeliveryDto, { ...base, address: '' })
    const errs = await validate(dto)
    expect(errs.some(e => e.property === 'address')).toBe(true)
  })
})
