import 'reflect-metadata'
import { Test, TestingModule } from '@nestjs/testing'
import { NotFoundException } from '@nestjs/common'
import { ProductService } from '../../src/product/product.service'
import { Product } from '../../src/product/domain/product.model'
import { CreateProductDto } from '../../src/product/dto/create-product.dto'
import { UpdateProductDto } from '../../src/product/dto/update-product.dto'

function mockRepo() {
  return {
    findAll:  jest.fn(),
    findById: jest.fn(),
    create:   jest.fn(),
    update:   jest.fn(),
    delete:   jest.fn(),
  }
}

const sampleProduct = new Product(
  'f88f7d0e-793b-4902-b3bb-d2b7d2f4e123',
  'Taza Wompi',
  'Taza mágica color negro',
  25_000,
  5,
)

describe('ProductService', () => {
  let service: ProductService
  let repo: ReturnType<typeof mockRepo>

  beforeEach(async () => {
    repo = mockRepo()

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        { provide: 'ProductRepositoryPort', useValue: repo },
      ],
    }).compile()

    service = module.get(ProductService)
  })

  /* -------------------------------------------------------------- */
  it('findAll() delega en repo.findAll()', async () => {
    repo.findAll.mockResolvedValue([sampleProduct])

    const result = await service.findAll()

    expect(repo.findAll).toHaveBeenCalledTimes(1)
    expect(result).toEqual([sampleProduct])
  })

  /* -------------------------------------------------------------- */
  describe('findById()', () => {
    it('devuelve el producto si existe', async () => {
      repo.findById.mockResolvedValue(sampleProduct)

      const prod = await service.findById(sampleProduct.id)

      expect(repo.findById).toHaveBeenCalledWith(sampleProduct.id)
      expect(prod).toEqual(sampleProduct)
    })

    it('lanza NotFoundException si no existe', async () => {
      repo.findById.mockResolvedValue(null)

      await expect(service.findById('no-id'))
        .rejects.toBeInstanceOf(NotFoundException)
    })
  })

  /* -------------------------------------------------------------- */
  it('create() delega en repo.create()', async () => {
    const dto: CreateProductDto = {
      name: 'Camiseta Wompi',
      description: 'Ed. limitada',
      price: 59_000,
      stock: 10,
    }

    repo.create.mockResolvedValue(sampleProduct)

    const result = await service.create(dto)

    expect(repo.create).toHaveBeenCalledWith(dto)
    expect(result).toEqual(sampleProduct)
  })

  /* -------------------------------------------------------------- */
  it('update() valida existencia y delega en repo.update()', async () => {
    const dto: UpdateProductDto = { price: 30_000 }

    repo.findById.mockResolvedValue(sampleProduct)
    repo.update.mockResolvedValue(
      new Product(
        sampleProduct.id,
        sampleProduct.name,
        sampleProduct.description,
        30_000,
        sampleProduct.stock,
      ),
    )

    const result = await service.update(sampleProduct.id, dto)

    expect(repo.update).toHaveBeenCalledWith(sampleProduct.id, dto)
    expect(result.price).toBe(30_000)
  })

  /* -------------------------------------------------------------- */
  it('delete() valida existencia y delega en repo.delete()', async () => {
    repo.findById.mockResolvedValue(sampleProduct)
    repo.delete.mockResolvedValue(undefined)

    await service.delete(sampleProduct.id)

    expect(repo.delete).toHaveBeenCalledWith(sampleProduct.id)
  })
})
