// src/modules/product/product.controller.ts
import { Controller, Get, Post, Put, Delete, HttpCode, HttpStatus, Param, Body } from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './domain/product.model';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  // Endpoint para la página inicial: lista todos los productos
  @Get()
  async findAll(): Promise<Product[]> {
    return this.productService.findAll();
  }

  // Obtiene un producto por ID
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Product> {
    return this.productService.findById(id);
  }

  // Crea un nuevo producto
  @Post()
  async create(@Body() dto: CreateProductDto): Promise<Product> {
    return this.productService.create(dto);
  }

  // Actualiza un producto existente
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
  ): Promise<Product> {
    return this.productService.update(id, dto);
  }

  // Elimina un producto
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.productService.delete(id);
  }
}
