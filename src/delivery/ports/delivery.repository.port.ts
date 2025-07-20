// src/modules/delivery/ports/delivery.repository.port.ts
import { CreateDeliveryDto } from '../dto/create-delivery.dto';
import { UpdateDeliveryDto } from '../dto/update-delivery.dto';
import { Delivery } from '../domain/delivery.model';

/**
 * Puerto que define las operaciones de acceso a datos para entregas
 */
export interface DeliveryRepositoryPort {
  /**
   * Lista todas las entregas
   */
  findAll(): Promise<Delivery[]>;

  /**
   * Busca una entrega por su ID. Retorna null si no existe.
   */
  findById(id: string): Promise<Delivery | null>;

  /**
   * Crea una nueva entrega a partir del DTO proporcionado
   */
  create(dto: CreateDeliveryDto): Promise<Delivery>;

  /**
   * Actualiza una entrega existente identificada por ID
   */
  update(id: string, dto: UpdateDeliveryDto): Promise<Delivery>;

  /**
   * Elimina la entrega identificada por ID
   */
  delete(id: string): Promise<void>;
}
