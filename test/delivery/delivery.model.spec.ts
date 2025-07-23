import { Delivery } from '../../src/delivery/domain/delivery.model'

describe('Delivery domain model', () => {
  const initialDate = new Date('2025-07-23T10:00:00.000Z')

  const base = () =>
    new Delivery(
      'del-1',
      'tx-123',
      'Calle 123',
      initialDate,
      'pending',
    )

  /* ------------------------------------------------------------ */
  it('crea la entrega con los datos iniciales', () => {
    const d = base()
    expect(d.status).toBe('pending')
    expect(d.address).toBe('Calle 123')
    expect(d.scheduledDate).toEqual(initialDate)
  })

  /* --------------------------- status -------------------------- */
  it('markInTransit() cambia estado a in_transit', () => {
    const d = base()
    d.markInTransit()
    expect(d.status).toBe('in_transit')
  })

  it('markDelivered() cambia estado a delivered', () => {
    const d = base()
    d.markDelivered()
    expect(d.status).toBe('delivered')
  })

  it('cancel() cambia estado a cancelled', () => {
    const d = base()
    d.cancel()
    expect(d.status).toBe('cancelled')
  })

  /* -------------------- reschedule / address ------------------- */
  it('reschedule() actualiza la fecha programada', () => {
    const d        = base()
    const newDate  = new Date('2025-07-24T15:30:00.000Z')
    d.reschedule(newDate)
    expect(d.scheduledDate).toEqual(newDate)
  })

  it('updateAddress() actualiza la dirección', () => {
    const d = base()
    d.updateAddress('Av. Siempre Viva 742')
    expect(d.address).toBe('Av. Siempre Viva 742')
  })
})
