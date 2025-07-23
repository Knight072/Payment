import 'reflect-metadata'                 // 👈 necesario para class‑validator
import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import { UpdateTransactionDto } from '../../src/transaction/dto/update-transaction.dto'

describe('UpdateTransactionDto', () => {
    it('acepta un objeto parcial (solo status)', async () => {
        const dto = plainToInstance(UpdateTransactionDto, {
            status: 'completed',
        })

        const errs = await validate(dto)
        expect(errs.length).toBe(0)
    })

    it('acepta actualizar solo la cantidad de un ítem', async () => {
        const dto = plainToInstance(UpdateTransactionDto, {
            items: [{ name: 'Taza Wompi', quantity: 2 }],
        })

        const errs = await validate(dto)
        expect(errs.length).toBe(0)
    })

    it('falla si el status tiene un valor fuera del union', async () => {
        const dto = plainToInstance(UpdateTransactionDto, {
            status: 'foo',
        })

        const errs = await validate(dto)
        expect(errs.some(e => e.property === 'status')).toBe(true)
    })
})
