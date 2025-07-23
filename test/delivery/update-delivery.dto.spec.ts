import 'reflect-metadata'                 
import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import { UpdateDeliveryDto } from '../../src/delivery/dto/update-delivery.dto'

describe('UpdateDeliveryDto', () => {

  const validBase: UpdateDeliveryDto = {
    orderId:       'd3ad6760-55cf-4c20-97ae-6eb0d9b5e0e1',
    address:       'Carrera 7 #45‑67',
    scheduledDate: '2025-07-23T10:00:00.000Z',
    status:        'in_transit',
  }

  it('acepta un objeto vacío (todos los campos opcionales)', async () => {
    const dto  = plainToInstance(UpdateDeliveryDto, {})
    const errs = await validate(dto)
    expect(errs.length).toBe(0)
  })

  it('acepta actualizar sólo el status', async () => {
    const dto  = plainToInstance(UpdateDeliveryDto, { status: 'delivered' })
    const errs = await validate(dto)
    expect(errs.length).toBe(0)
  })

  it('rechaza status inválido', async () => {
    const dto  = plainToInstance(UpdateDeliveryDto, { status: 'foo' })
    const errs = await validate(dto)
    expect(errs.some(e => e.property === 'status')).toBe(true)
  })

  it('rechaza orderId que no sea UUID', async () => {
    const dto  = plainToInstance(UpdateDeliveryDto, { orderId: '123' })
    const errs = await validate(dto)
    expect(errs.some(e => e.property === 'orderId')).toBe(true)
  })

  it('rechaza scheduledDate con formato no ISO', async () => {
    const dto  = plainToInstance(UpdateDeliveryDto, { scheduledDate: 'hoy' })
    const errs = await validate(dto)
    expect(errs.some(e => e.property === 'scheduledDate')).toBe(true)
  })

  it('acepta payload completo válido', async () => {
    const dto  = plainToInstance(UpdateDeliveryDto, validBase)
    const errs = await validate(dto)
    expect(errs.length).toBe(0)
  })
})
