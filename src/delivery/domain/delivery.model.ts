// src/modules/delivery/domain/delivery.model.ts
export class Delivery {
  constructor(
    public readonly id: string,
    public orderId: string,
    public address: string,
    public scheduledDate: Date,
    public status: 'pending' | 'in_transit' | 'delivered' | 'cancelled',
  ) {}

  /** Marca la entrega como en tránsito */
  markInTransit(): void {
    this.status = 'in_transit';
  }

  /** Marca la entrega como completada */
  markDelivered(): void {
    this.status = 'delivered';
  }

  /** Cancela la entrega */
  cancel(): void {
    this.status = 'cancelled';
  }

  /** Reprograma la entrega */
  reschedule(newDate: Date): void {
    this.scheduledDate = newDate;
  }

  /** Actualiza la dirección de entrega */
  updateAddress(newAddress: string): void {
    this.address = newAddress;
  }
}
