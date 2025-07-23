import 'reflect-metadata'
import { Test, TestingModule } from '@nestjs/testing'
import { NotFoundException, BadRequestException } from '@nestjs/common'
import { TransactionService } from '../../src/transaction/transaction.service'
import { Transaction } from '../../src/transaction/domain/transaction.model'
import { CreateTransactionDto } from '../../src/transaction/dto/create-transaction.dto'
import { UpdateTransactionDto } from '../../src/transaction/dto/update-transaction.dto'

function mockTxRepo() {
  return {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  }
}

function mockCustomerRepo() {
  return {
    findByEmail: jest.fn(),
    create: jest.fn(),
  }
}

function mockDeliveryRepo() {
  return {
    create: jest.fn(),
  }
}

function mockProductRepo() {
  return {
    findAll: jest.fn(),
    update: jest.fn(),
  }
}

/* -------------------------------------------------------------- */
/* Datos de muestra                                                */
/* -------------------------------------------------------------- */
const mockDate  = new Date('2025-07-22T19:29:02.591Z')
const sampleTx  = new Transaction(
  'tx-1',
  'Taza Wompi×1',
  32000,
  mockDate,
  'pending',
)

const createDto: CreateTransactionDto = {
  description:   sampleTx.description,
  amount:        sampleTx.amount,
  date:          mockDate.toISOString(),
  status:        'pending',
  firstName:     'Anna',
  lastName:      'Smith',
  document:      '123456789',
  customerEmail: 'anna@example.com',
  phone:         '3015551234',
  address:       'Calle 123',
  scheduledDate: mockDate.toISOString(),
  items:         [{ name: 'Taza Wompi', quantity: 1 }],
}

const productsMock = [
  { id: 1, name: 'Taza Wompi', stock: 5 },
]

/* -------------------------------------------------------------- */
/* Test Suite                                                      */
/* -------------------------------------------------------------- */
describe('TransactionService', () => {
  let service: TransactionService
  let txRepo:      ReturnType<typeof mockTxRepo>
  let customerRepo:ReturnType<typeof mockCustomerRepo>
  let deliveryRepo:ReturnType<typeof mockDeliveryRepo>
  let productRepo: ReturnType<typeof mockProductRepo>

  beforeEach(async () => {
    txRepo       = mockTxRepo()
    customerRepo = mockCustomerRepo()
    deliveryRepo = mockDeliveryRepo()
    productRepo  = mockProductRepo()

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        { provide: 'TransactionRepositoryPort', useValue: txRepo },
        { provide: 'CustomerRepositoryPort',   useValue: customerRepo },
        { provide: 'DeliveryRepositoryPort',   useValue: deliveryRepo },
        { provide: 'ProductRepositoryPort',    useValue: productRepo },
      ],
    }).compile()

    service = module.get(TransactionService)
  })

  /* ---------------------------------------------------------- */
  it('findAll delega en repo.findAll()', async () => {
    txRepo.findAll.mockResolvedValue([sampleTx])

    const result = await service.findAll()

    expect(txRepo.findAll).toHaveBeenCalled()
    expect(result).toEqual([sampleTx])
  })

  /* ---------------------------------------------------------- */
  it('findById devuelve la transacción si existe', async () => {
    txRepo.findById.mockResolvedValue(sampleTx)

    const tx = await service.findById('tx-1')

    expect(txRepo.findById).toHaveBeenCalledWith('tx-1')
    expect(tx).toBe(sampleTx)
  })

  it('findById lanza NotFoundException si no existe', async () => {
    txRepo.findById.mockResolvedValue(null)

    await expect(service.findById('no-id')).rejects.toBeInstanceOf(NotFoundException)
  })

  /* ---------------------------------------------------------- */
  describe('create()', () => {
    beforeEach(() => {
      productRepo.findAll.mockResolvedValue(productsMock)
      txRepo.create.mockResolvedValue(sampleTx) // pending
      txRepo.update.mockResolvedValue({ ...sampleTx, status: 'completed' })
      deliveryRepo.create.mockResolvedValue({ id: 'del-1' })
    })

    it('crea transacción y entrega cuando hay stock', async () => {
      customerRepo.findByEmail.mockResolvedValue(null)
      customerRepo.create.mockResolvedValue({ id: 'cust-1' })

      const result = await service.create(createDto)

      // stock actualizado
      expect(productRepo.update).toHaveBeenCalledWith(1, { stock: 4 })
      // transacción pending creada
      expect(txRepo.create).toHaveBeenCalled()
      // entrega creada
      expect(deliveryRepo.create).toHaveBeenCalled()
      // transacción final en estado completed
      expect(result.status).toBe('completed')
    })

    it('lanza BadRequestException si stock insuficiente', async () => {
      productRepo.findAll.mockResolvedValue([{ id: 1, name: 'Taza Wompi', stock: 0 }])

      await expect(service.create(createDto)).rejects.toBeInstanceOf(BadRequestException)
      expect(txRepo.create).not.toHaveBeenCalled()
    })
  })

  /* ---------------------------------------------------------- */
  it('update() delega a repositorio después de validar existencia', async () => {
    txRepo.findById.mockResolvedValue(sampleTx)
    txRepo.update.mockResolvedValue({ ...sampleTx, status: 'cancelled' })

    const dto: UpdateTransactionDto = { status: 'cancelled' }

    const res = await service.update('tx-1', dto)

    expect(txRepo.update).toHaveBeenCalledWith('tx-1', dto)
    expect(res.status).toBe('cancelled')
  })

  /* ---------------------------------------------------------- */
  it('delete() delega a repositorio después de validar existencia', async () => {
    txRepo.findById.mockResolvedValue(sampleTx)
    txRepo.delete.mockResolvedValue(undefined)

    await service.delete('tx-1')

    expect(txRepo.delete).toHaveBeenCalledWith('tx-1')
  })
})