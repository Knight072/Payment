// src/modules/product/domain/product.model.ts
export class Product {
    constructor(
        public readonly id: string,
        public name: string,
        public description: string,
        public price: number,
        public stock: boolean = true,
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
        this.stock = false;
    }

    /**
     * Marca el producto como disponible
     */
    markInStock(): void {
        this.stock = true;
    }
}
