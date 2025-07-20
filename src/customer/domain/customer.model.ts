// src/modules/customer/domain/customer.model.ts
export class Customer {
  constructor(
    public readonly id: string,
    public firstName: string,
    public lastName: string,
    public email: string,
    public document: string,
    public phone?: string,
    public createdAt: Date = new Date(),
    public updatedAt?: Date,
  ) {}

  /**
   * Actualiza el correo electrónico del cliente
   */
  updateEmail(newEmail: string): void {
    this.email = newEmail;
    this.touchUpdated();
  }

  /**
   * Actualiza el nombre completo del cliente
   */
  updateName(firstName: string, lastName: string): void {
    this.firstName = firstName;
    this.lastName = lastName;
    this.touchUpdated();
  }

  /**
   * Actualiza el número de teléfono del cliente
   */
  updatePhone(newPhone: string): void {
    this.phone = newPhone;
    this.touchUpdated();
  }

  /**
   * Marca la entidad como actualizada cambiando updatedAt
   */
  private touchUpdated(): void {
    this.updatedAt = new Date();
  }
}
