// src/modules/product/domain/product.model.ts
export class Product {
  constructor(
    public readonly id: string,
    public name: string,
    public description: string,
    public price: number,
    public stock: number,
  ) {
    this.validate();
  }

  /** Aumenta el stock en la cantidad dada */
  increaseStock(amount: number): void {
    if (amount <= 0) {
      throw new Error('La cantidad a aumentar debe ser mayor que cero');
    }
    this.stock += amount;
  }

  /** Disminuye el stock en la cantidad dada */
  decreaseStock(amount: number): void {
    if (amount <= 0) {
      throw new Error('La cantidad a disminuir debe ser mayor que cero');
    }
    if (this.stock - amount < 0) {
      throw new Error('No hay suficiente stock para esta operación');
    }
    this.stock -= amount;
  }

  /** Actualiza el precio del producto */
  updatePrice(newPrice: number): void {
    if (newPrice <= 0) {
      throw new Error('El precio debe ser mayor que cero');
    }
    this.price = newPrice;
  }

  /** Validaciones iniciales de negocio */
  private validate(): void {
    if (!this.name.trim()) {
      throw new Error('El nombre es obligatorio');
    }
    if (this.price <= 0) {
      throw new Error('El precio debe ser mayor que cero');
    }
    if (this.stock < 0) {
      throw new Error('El stock no puede ser negativo');
    }
  }
}
