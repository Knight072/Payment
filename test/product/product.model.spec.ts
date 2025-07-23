import 'reflect-metadata'
import { Product } from '../../src/product/domain/product.model'

describe('Product domain model', () => {
  /* -------------------------------------------------------------- */
  const base = () =>
    new Product(
      'f88f7d0e-793b-4902-b3bb-d2b7d2f4e123',
      'Taza W',
      'Taza mágica color negro',
      25_000,
      5,
    )

  /* ---------------- constructor / validate ---------------------- */
  it('crea el producto con datos válidos', () => {
    const prod = base()
    expect(prod.name).toBe('Taza W')
    expect(prod.price).toBe(25_000)
    expect(prod.stock).toBe(5)
  })

  it.each([
    { name: '',            msg: 'El nombre es obligatorio' },
    { price: 0,            msg: 'El precio debe ser mayor que cero' },
    { price: -10,          msg: 'El precio debe ser mayor que cero' },
    { stock: -1,           msg: 'El stock no puede ser negativo' },
  ])('lanza error si datos inválidos', (patch) => {
    expect(
      () =>
        new Product(
          'id',
          'name' in patch ? '' : 'Ok',
          'desc',
          'price' in patch ? patch.price! : 10,
          'stock' in patch ? patch.stock! : 0,
        ),
    ).toThrow(patch.msg)
  })

  /* ---------------- increaseStock ------------------------------- */
  it('increaseStock(): suma cantidad', () => {
    const prod = base()
    prod.increaseStock(3)
    expect(prod.stock).toBe(8)
  })

  it('increaseStock(): error si cantidad ≤ 0', () => {
    const prod = base()
    expect(() => prod.increaseStock(0))
      .toThrow('La cantidad a aumentar debe ser mayor que cero')
  })

  /* ---------------- decreaseStock ------------------------------- */
  it('decreaseStock(): resta cantidad', () => {
    const prod = base()
    prod.decreaseStock(2)
    expect(prod.stock).toBe(3)
  })

  it('decreaseStock(): error si cantidad ≤ 0', () => {
    const prod = base()
    expect(() => prod.decreaseStock(0))
      .toThrow('La cantidad a disminuir debe ser mayor que cero')
  })

  it('decreaseStock(): error si stock insuficiente', () => {
    const prod = base()
    expect(() => prod.decreaseStock(10))
      .toThrow('No hay suficiente stock para esta operación')
  })

  /* ---------------- updatePrice --------------------------------- */
  it('updatePrice(): cambia el precio', () => {
    const prod = base()
    prod.updatePrice(30_000)
    expect(prod.price).toBe(30_000)
  })

  it('updatePrice(): error si ≤ 0', () => {
    const prod = base()
    expect(() => prod.updatePrice(0))
      .toThrow('El precio debe ser mayor que cero')
  })
})
