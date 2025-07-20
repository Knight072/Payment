// src/modules/product/domain/product.model.ts
export class Product {
    constructor(
        public readonly id: string,
        public name: string,
        public price: number,
        public inStock: boolean = true,
    ) { }

    /**
     * Actualiza el precio del producto
     */
    updatePrice(newPrice: number): void {
        this.price = newPrice;
    }

    /**
     * Marca el producto como agotado
     */
    markOutOfStock(): void {
        this.inStock = false;
    }

    /**
     * Marca el producto como disponible
     */
    markInStock(): void {
        this.inStock = true;
    }
}
