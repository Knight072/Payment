// src/modules/transaction/domain/transaction.model.ts
export class Transaction {
  constructor(
    public readonly id: string,
    public description: string,
    public amount: number,
    public date: Date,
    public status: string,
  ) {}

  /** Marca la transacción como completada */
  complete(): void {
    this.status = 'completed';
  }

  /** Marca la transacción como cancelada */
  cancel(): void {
    this.status = 'cancelled';
  }

  /** Actualiza la descripción de la transacción */
  updateDescription(newDesc: string): void {
    this.description = newDesc;
  }

  /** Ajusta el monto de la transacción */
  adjustAmount(newAmount: number): void {
    this.amount = newAmount;
  }

  /** Cambia la fecha de la transacción */
  reschedule(newDate: Date): void {
    this.date = newDate;
  }
}