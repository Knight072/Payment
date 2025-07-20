// src/modules/customer/customer.controller.ts
import { Controller, Get, Post, Put, Delete, Param, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { Customer } from './domain/customer.model';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  /**
   * Lista todos los clientes
   */
  @Get()
  async findAll(): Promise<Customer[]> {
    return this.customerService.findAll();
  }

  /**
   * Obtiene un cliente por ID
   */
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Customer> {
    return this.customerService.findById(id);
  }

  /**
   * Crea un nuevo cliente
   */
  @Post()
  async create(@Body() dto: CreateCustomerDto): Promise<Customer> {
    return this.customerService.create(dto);
  }

  /**
   * Actualiza un cliente existente
   */
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCustomerDto,
  ): Promise<Customer> {
    return this.customerService.update(id, dto);
  }

  /**
   * Elimina un cliente
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.customerService.delete(id);
  }
}
