import 'reflect-metadata'
import { Repository } from 'typeorm'
import { ProductRepositoryAdapter } from '../../src/product/adapters/product.repository.adapter'
import { ProductEntity } from '../../src/product/adapters/product.entity'
import { Product } from '../../src/product/domain/product.model'
import { CreateProductDto } from '../../src/product/dto/create-product.dto'
import { UpdateProductDto } from '../../src/product/dto/update-product.dto'

function makeRepoMock(): jest.Mocked<Repository<ProductEntity>> {
    return {
        find: jest.fn(),
        findOneBy: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
        merge: jest.fn(),
        delete: jest.fn(),
    } as unknown as jest.Mocked<Repository<ProductEntity>>
}

const entitySample: ProductEntity = {
    id: 'f88f7d0e-793b-4902-b3bb-d2b7d2f4e123',
    name: 'Taza W',
    description: 'Taza mágica color negro',
    price: 25000,
    stock: 5,
} as ProductEntity

const domainSample = new Product(
    entitySample.id,
    entitySample.name,
    entitySample.description,
    entitySample.price,
    entitySample.stock,
)

describe('ProductRepositoryAdapter', () => {
    let repo: jest.Mocked<Repository<ProductEntity>>
    let adapter: ProductRepositoryAdapter

    beforeEach(() => {
        repo = makeRepoMock()
        adapter = new ProductRepositoryAdapter(repo)
    })

    /* -------------------------------------------------------------- */
    it('findAll(): mapea entidades → dominio', async () => {
        repo.find.mockResolvedValue([entitySample])

        const result = await adapter.findAll()

        expect(repo.find).toHaveBeenCalled()
        expect(result).toEqual([domainSample])
    })

    /* -------------------------------------------------------------- */
    it('findById(): devuelve dominio si existe, null si no', async () => {
        repo.findOneBy.mockResolvedValue(entitySample)

        const found = await adapter.findById(entitySample.id)
        expect(found).toEqual(domainSample)

        repo.findOneBy.mockResolvedValue(null)
        const notFound = await adapter.findById('no-id')
        expect(notFound).toBeNull()
    })

    /* -------------------------------------------------------------- */
    it('create(): delega en repo.create + save', async () => {
        const dto: CreateProductDto = {
            name: 'Camiseta W',
            description: 'Ed. limitada',
            price: 59000,
            stock: 10,
        }

        repo.create.mockReturnValue(entitySample)
        repo.save.mockResolvedValue(entitySample)

        const result = await adapter.create(dto)

        expect(repo.create).toHaveBeenCalledWith({
            ...dto,
            stock: dto.stock ?? 0,
        })
        expect(repo.save).toHaveBeenCalledWith(entitySample)
        expect(result).toEqual(domainSample)
    })

    /* -------------------------------------------------------------- */
    describe('update()', () => {
        it('actualiza y devuelve dominio', async () => {
            const dto: UpdateProductDto = { price: 26000 }

            repo.findOneBy.mockResolvedValue(entitySample)
            const merged = { ...entitySample, price: 26000 }
            repo.merge.mockReturnValue(merged)
            repo.save.mockResolvedValue(merged)

            const result = await adapter.update(entitySample.id, dto)

            expect(repo.merge).toHaveBeenCalledWith(entitySample, {
                name: dto.name ?? entitySample.name,
                description: dto.description ?? entitySample.description,
                price: dto.price ?? entitySample.price,
                stock: dto.stock ?? entitySample.stock,
            })
            expect(result.price).toBe(26000)
        })

        it('lanza error si producto no existe', async () => {
            repo.findOneBy.mockResolvedValue(null)

            await expect(
                adapter.update('no-id', { price: 100 } as UpdateProductDto),
            ).rejects.toThrow('Producto no existe')
        })
    })

    /* -------------------------------------------------------------- */
    it('delete(): delega en repo.delete', async () => {
        repo.delete.mockResolvedValue({} as any)

        await adapter.delete(entitySample.id)

        expect(repo.delete).toHaveBeenCalledWith(entitySample.id)
    })

    /* -------------------------------------------------------------- */
    describe('increaseStock()', () => {
        it('suma stock y guarda', async () => {
            repo.findOneBy.mockResolvedValue({ ...entitySample })
            const saved = { ...entitySample, stock: 8 }
            repo.save.mockResolvedValue(saved)

            const result = await adapter.increaseStock(entitySample.id, 3)

            expect(repo.save).toHaveBeenCalled()
            expect(result.stock).toBe(8)
        })

        it('lanza error si no existe', async () => {
            repo.findOneBy.mockResolvedValue(null)

            await expect(
                adapter.increaseStock('no-id', 2),
            ).rejects.toThrow('Producto no existe')
        })
    })

    /* -------------------------------------------------------------- */
    describe('decreaseStock()', () => {
        it('resta stock y guarda', async () => {
            repo.findOneBy.mockResolvedValue({ ...entitySample })
            const saved = { ...entitySample, stock: 3 }
            repo.save.mockResolvedValue(saved)

            const result = await adapter.decreaseStock(entitySample.id, 2)

            expect(result.stock).toBe(3)
        })

        it('lanza error si no existe', async () => {
            await expect(
                adapter.increaseStock('no-id', 2),
            ).rejects.toThrow(/Producto .* no existe/)
        })

        it('lanza error si no existe', async () => {
            await expect(
                adapter.decreaseStock('no-id', 1),
            ).rejects.toThrow(/Producto .* no existe/)
        })
    })
})
