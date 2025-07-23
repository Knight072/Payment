import 'reflect-metadata'
import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import { CreateProductDto } from '../../src/product/dto/create-product.dto'

describe('CreateProductDto', () => {
    const base: CreateProductDto = {
        name: 'Taza W',
        description: 'Taza mágica color negro',
        price: 25000,
        stock: 5,
    }

    it('acepta un payload válido', async () => {
        const dto = plainToInstance(CreateProductDto, base)
        const errs = await validate(dto)
        expect(errs.length).toBe(0)
    })

    it.each`
    field          | value   | messageFragment
    ${'name'}      | ${''}   | ${'name'}
    ${'description'}| ${''}  | ${'description'}
    ${'price'}     | ${-10}  | ${'price'}
    ${'stock'}     | ${-1}   | ${'stock'}
  `('falla si $field es inválido', async ({ field, value, messageFragment }) => {
        const dto = plainToInstance(CreateProductDto, { ...base, [field]: value })
        const errs = await validate(dto)
        expect(errs.some(e => e.property === field)).toBe(true)
    })
})
