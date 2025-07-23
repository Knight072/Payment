import 'reflect-metadata'                      // necesario para class‑validator
import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import { UpdateProductDto } from '../../src/product/dto/update-product.dto'

describe('UpdateProductDto', () => {
    it('acepta un objeto vacío (todos los campos opcionales)', async () => {
        const dto = plainToInstance(UpdateProductDto, {})
        const errs = await validate(dto)
        expect(errs.length).toBe(0)
    })

    it('acepta actualizar solo el precio', async () => {
        const dto = plainToInstance(UpdateProductDto, { price: 9990 })
        const errs = await validate(dto)
        expect(errs.length).toBe(0)
    })

    it('rechaza precio negativo', async () => {
        const dto = plainToInstance(UpdateProductDto, { price: -1 })
        const errs = await validate(dto)
        expect(errs.some(e => e.property === 'price')).toBe(true)
    })

    it('rechaza stock negativo', async () => {
        const dto = plainToInstance(UpdateProductDto, { stock: -5 })
        const errs = await validate(dto)
        expect(errs.some(e => e.property === 'stock')).toBe(true)
    })
})
