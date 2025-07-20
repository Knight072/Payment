// src/modules/delivery/adapters/typeorm/delivery.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Delivery } from '../domain/delivery.model';

@Entity({ name: 'deliveries' })
export class DeliveryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  orderId: string;

  @Column({ type: 'varchar', length: 255 })
  address: string;

  @Column({ type: 'timestamp' })
  scheduledDate: Date;

  @Column({ type: 'varchar', length: 20 })
  status: string;

  /**
   * Convierte la entidad a su modelo de dominio
   */
  static toDomain(entity: DeliveryEntity): Delivery {
    return new Delivery(
      entity.id,
      entity.orderId,
      entity.address,
      entity.scheduledDate,
      entity.status as 'pending' | 'in_transit' | 'delivered' | 'cancelled',
    );
  }

  /**
   * Crea una entidad a partir del modelo de dominio
   */
  static fromDomain(delivery: Delivery): DeliveryEntity {
    const entity = new DeliveryEntity();
    entity.id = delivery.id;
    entity.orderId = delivery.orderId;
    entity.address = delivery.address;
    entity.scheduledDate = delivery.scheduledDate;
    entity.status = delivery.status;
    return entity;
  }
}