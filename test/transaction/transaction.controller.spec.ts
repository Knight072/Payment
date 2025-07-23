import 'reflect-metadata'
import { Test, TestingModule } from '@nestjs/testing'
import { HttpStatus } from '@nestjs/common'
import { TransactionController } from '../../src/transaction/transaction.controller'
import { TransactionService } from '../../src/transaction/transaction.service'
import { Transaction } from '../../src/transaction/domain/transaction.model'
import { CreateTransactionDto } from '../../src/transaction/dto/create-transaction.dto'
import { UpdateTransactionDto } from '../../src/transaction/dto/update-transaction.dto'

describe('TransactionController', () => {
    let controller: TransactionController
    let service: jest.Mocked<TransactionService>

    /* -------------------------------------------------------------- */
    // Utilidades de mocks
    const mockDate = new Date('2025-07-22T19:29:02.591Z')
    const sampleTx: Transaction = new Transaction(
        'b91d87b0-11f0-4eec-8e40-f057e57254c7',
        'Taza Wompi×1',
        32000,
        mockDate,
        'pending',
    )

    const serviceMockFactory = (): jest.Mocked<TransactionService> => ({
        findAll: jest.fn(),
        findById: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    } as unknown as jest.Mocked<TransactionService>)

    /* -------------------------------------------------------------- */
    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [TransactionController],
            providers: [{ provide: TransactionService, useFactory: serviceMockFactory }],
        }).compile()

        controller = module.get(TransactionController)
        service = module.get(TransactionService)
    })

    /* -------------------------------------------------------------- */
    it('findAll() debería delegar a service.findAll()', async () => {
        service.findAll.mockResolvedValue([sampleTx])

        const result = await controller.findAll()

        expect(service.findAll).toHaveBeenCalledTimes(1)
        expect(result).toEqual([sampleTx])
    })

    /* -------------------------------------------------------------- */
    it('findOne() debería delegar a service.findById()', async () => {
        service.findById.mockResolvedValue(sampleTx)

        const result = await controller.findOne(sampleTx.id)

        expect(service.findById).toHaveBeenCalledWith(sampleTx.id)
        expect(result).toEqual(sampleTx)
    })

    /* -------------------------------------------------------------- */
    it('create() debería delegar a service.create()', async () => {
        const dto: CreateTransactionDto = {
            description: sampleTx.description,
            amount: sampleTx.amount,
            date: sampleTx.date.toISOString(),
            status: 'pending',
            firstName: 'John',
            lastName: 'Doe',
            document: '123456789',
            customerEmail: 'john@example.com',
            phone: '3015551111',
            address: 'Calle 123',
            scheduledDate: sampleTx.date.toISOString(),
            items: [{ name: 'Taza Wompi', quantity: 1 }],
            cardNumber: '4111111111111111',
            cardCvc: '123',
            cardExpMonth: '11',
            cardExpYear: '25',
        }

        service.create.mockResolvedValue(sampleTx)

        const result = await controller.create(dto)

        expect(service.create).toHaveBeenCalledWith(dto)
        expect(result).toEqual(sampleTx)
    })

    /* -------------------------------------------------------------- */
    it('update() debería delegar a service.update()', async () => {
        const dto: UpdateTransactionDto = { status: 'completed' }

        service.update.mockResolvedValue(
            new Transaction(
                sampleTx.id,
                sampleTx.description,
                sampleTx.amount,
                sampleTx.date,
                'completed',          
            ),
        )

        const result = await controller.update(sampleTx.id, dto)

        expect(service.update).toHaveBeenCalledWith(sampleTx.id, dto)
        expect(result.status).toBe('completed')
    })

    /* -------------------------------------------------------------- */
    it('remove() debería delegar a service.delete() y devolver NO_CONTENT', async () => {
        service.delete.mockResolvedValue(undefined)

        await expect(controller.remove(sampleTx.id)).resolves.toBeUndefined()
        expect(service.delete).toHaveBeenCalledWith(sampleTx.id)
    })
})
