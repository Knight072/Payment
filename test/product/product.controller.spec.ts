import 'reflect-metadata'
import { Test, TestingModule } from '@nestjs/testing'
import { ProductController } from '../../src/product/product.controller'
import { ProductService } from '../../src/product/product.service'
import { Product } from '../../src/product/domain/product.model'
import { CreateProductDto } from '../../src/product/dto/create-product.dto'
import { UpdateProductDto } from '../../src/product/dto/update-product.dto'

describe('ProductController', () => {
    let controller: ProductController
    let service: jest.Mocked<ProductService>

    /* ------------------------------------------------------------ */
    // mock factory para ProductService
    const serviceMockFactory = (): jest.Mocked<ProductService> => ({
        findAll: jest.fn(),
        findById: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    } as unknown as jest.Mocked<ProductService>)

    // muestra de producto
    const sampleProduct = new Product(
        'f88f7d0e-793b-4902-b3bb-d2b7d2f4e123',
        'Taza Wompi',
        'Taza mágica color negro',
        25000,
        5,
    )

    /* ------------------------------------------------------------ */
    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ProductController],
            providers: [{ provide: ProductService, useFactory: serviceMockFactory }],
        }).compile()

        controller = module.get(ProductController)
        service = module.get(ProductService)
    })

    /* ------------------------------------------------------------ */
    it('findAll() delega en service.findAll()', async () => {
        service.findAll.mockResolvedValue([sampleProduct])

        const result = await controller.findAll()

        expect(service.findAll).toHaveBeenCalledTimes(1)
        expect(result).toEqual([sampleProduct])
    })

    /* ------------------------------------------------------------ */
    it('findOne() delega en service.findById()', async () => {
        service.findById.mockResolvedValue(sampleProduct)

        const result = await controller.findOne(sampleProduct.id)

        expect(service.findById).toHaveBeenCalledWith(sampleProduct.id)
        expect(result).toEqual(sampleProduct)
    })

    /* ------------------------------------------------------------ */
    it('create() delega en service.create()', async () => {
        const dto: CreateProductDto = {
            name: 'Camiseta Wompi',
            description: 'Ed. limitada',
            price: 59000,
            stock: 10,
        }

        service.create.mockResolvedValue(sampleProduct)

        const result = await controller.create(dto)

        expect(service.create).toHaveBeenCalledWith(dto)
        expect(result).toEqual(sampleProduct)
    })

    /* ------------------------------------------------------------ */
    it('update() delega en service.update()', async () => {
        const dto: UpdateProductDto = { price: 26000 }

        service.update.mockResolvedValue(
            new Product(
                sampleProduct.id,
                sampleProduct.name,
                sampleProduct.description,
                26000,                 // nuevo precio
                sampleProduct.stock,
            ),
        )

        const result = await controller.update(sampleProduct.id, dto)

        expect(service.update).toHaveBeenCalledWith(sampleProduct.id, dto)
        expect(result.price).toBe(26000)
    })

    /* ------------------------------------------------------------ */
    it('remove() delega en service.delete() y responde void', async () => {
        service.delete.mockResolvedValue(undefined)

        await expect(controller.remove(sampleProduct.id)).resolves.toBeUndefined()
        expect(service.delete).toHaveBeenCalledWith(sampleProduct.id)
    })
})
