import { Repository } from 'typeorm'
import { TransactionRepositoryAdapter } from '../../src/transaction/adapters/transaction.repository.adapter'
import { TransactionEntity } from '../../src/transaction/adapters/transaction.entity'
import { Transaction } from '../../src/transaction/domain/transaction.model'
import { CreateTransactionDto } from '../../src/transaction/dto/create-transaction.dto'
import { UpdateTransactionDto } from '../../src/transaction/dto/update-transaction.dto'

const sampleEntity: TransactionEntity = {
    id: 'b91d87b0-11f0-4eec-8e40-f057e57254c7',
    description: 'Taza Wompi×1',
    amount: 32000,
    date: new Date('2025-07-22T19:29:02.591Z'),
    status: 'completed',
} as TransactionEntity

const sampleDomain = new Transaction(
    sampleEntity.id,
    sampleEntity.description,
    sampleEntity.amount,
    sampleEntity.date,
    sampleEntity.status,
)


function makeRepoMock(): jest.Mocked<Repository<TransactionEntity>> {
    return {
        find: jest.fn(),
        findOne: jest.fn(),
        findOneOrFail: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    } as unknown as jest.Mocked<Repository<TransactionEntity>>
}


describe('TransactionRepositoryAdapter', () => {
    let repoMock: jest.Mocked<Repository<TransactionEntity>>
    let adapter: TransactionRepositoryAdapter

    beforeEach(() => {
        repoMock = makeRepoMock()
        adapter = new TransactionRepositoryAdapter(repoMock)
    })

    /* -------------------------------------------------------------- */
    it('findAll(): mapea entidades a dominio', async () => {
        repoMock.find.mockResolvedValue([sampleEntity])

        const result = await adapter.findAll()

        expect(repoMock.find).toHaveBeenCalledTimes(1)
        expect(result).toEqual([sampleDomain])
    })

    /* -------------------------------------------------------------- */
    it('findById(): devuelve null si no existe', async () => {
        repoMock.findOne.mockResolvedValue(null as any)

        const result = await adapter.findById('no-id')

        expect(repoMock.findOne).toHaveBeenCalledWith({ where: { id: 'no-id' } })
        expect(result).toBeNull()
    })

    it('findById(): mapea entidad existente', async () => {
        repoMock.findOne.mockResolvedValue(sampleEntity)

        const result = await adapter.findById(sampleEntity.id)

        expect(result).toEqual(sampleDomain)
    })

    /* -------------------------------------------------------------- */
    it('create(): delega en repo.create + save y devuelve dominio', async () => {
        const dto: CreateTransactionDto = {
            description: sampleEntity.description,
            amount: sampleEntity.amount,
            date: sampleEntity.date.toISOString(),
            status: 'pending',

            // Cliente
            firstName: 'John',
            lastName: 'Doe',
            document: '123456789',
            phone: '3015552222',
            customerEmail: 'john@example.com',

            // Entrega
            address: 'Calle 123',
            scheduledDate: new Date().toISOString(),

            // Ítems
            items: [{ name: 'Taza Wompi', quantity: 1 }],

            // Tarjeta (opcional)
            cardNumber: '4111111111111111',
            cardCvc: '123',
            cardExpMonth: '11',
            cardExpYear: '25',
        }

        repoMock.create.mockReturnValue(sampleEntity)
        repoMock.save.mockResolvedValue(sampleEntity)

        // 👉  dto es CreateTransactionDto, sin cast a Partial
        const result = await adapter.create(dto)

        expect(repoMock.create).toHaveBeenCalledWith(dto)
        expect(repoMock.save).toHaveBeenCalledWith(sampleEntity)
        expect(result).toEqual(sampleDomain)
    })



    /* -------------------------------------------------------------- */
    it('update(): llama update y findOneOrFail, devuelve dominio', async () => {
        const dto: UpdateTransactionDto = { status: 'cancelled' }

        repoMock.update.mockResolvedValue({} as any)
        repoMock.findOneOrFail.mockResolvedValue({ ...sampleEntity, status: 'cancelled' })

        const result = await adapter.update(sampleEntity.id, dto)

        expect(repoMock.update).toHaveBeenCalledWith(sampleEntity.id, dto)
        expect(repoMock.findOneOrFail).toHaveBeenCalledWith({ where: { id: sampleEntity.id } })
        expect(result.status).toBe('cancelled')
    })

    /* -------------------------------------------------------------- */
    it('delete(): delega en repo.delete', async () => {
        repoMock.delete.mockResolvedValue({} as any)

        await adapter.delete(sampleEntity.id)

        expect(repoMock.delete).toHaveBeenCalledWith(sampleEntity.id)
    })
})
