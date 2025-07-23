import 'reflect-metadata'

import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import { CreateTransactionDto } from '../../src/transaction/dto/create-transaction.dto'

describe('CreateTransactionDto', () => {
    const base: CreateTransactionDto = {
        description: 'Taza W×1',
        amount: 32000,
        date: '2025-07-22T19:29:02.591Z',
        status: 'pending',
        firstName: 'Juan',
        lastName: 'Pérez',
        document: '123456789',
        phone: '3015551111',
        customerEmail: 'juan@example.com',
        address: 'Cra 7 #45‑67',
        scheduledDate: '2025-07-23T10:00:00.000Z',
        items: [
            { name: 'Taza W', quantity: 1 },
        ],
        cardNumber: '4111111111111111',
        cardCvc: '123',
        cardExpMonth: '11',
        cardExpYear: '25',
    }

    it('acepta un payload válido', async () => {
        const dto = plainToInstance(CreateTransactionDto, base)
        const errs = await validate(dto)
        expect(errs.length).toBe(0)
    })

    it('falla si falta un campo requerido', async () => {
        const { firstName, ...rest } = base
        const dto = plainToInstance(CreateTransactionDto, rest)
        const errs = await validate(dto)
        // esperamos al menos un error en firstName
        const fields = errs.map(e => e.property)
        expect(fields).toContain('firstName')
    })

    it('falla si status no está en el union', async () => {
        const dto = plainToInstance(CreateTransactionDto, { ...base, status: 'foo' as any })
        const errs = await validate(dto)
        expect(errs.some(e => e.property === 'status')).toBe(true)
    })

    it('falla si quantity es < 1', async () => {
        const dto = plainToInstance(CreateTransactionDto, {
            ...base,
            items: [{ name: 'Taza W', quantity: 0 }],
        })

        const errs = await validate(dto)

        // buscamos el error en la propiedad items
        const itemsError = errs.find(e => e.property === 'items')

        expect(itemsError).toBeDefined()
        expect(itemsError!.children?.length).toBeGreaterThan(0)

        // primer hijo → error de quantity
        const quantityError = itemsError!.children![0]

        // constraints → debe existir la clave 'min'
        expect(quantityError.constraints?.min).toBeDefined()
    })

})
