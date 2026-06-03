import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('api')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('products')
  findAll(
    @Query('search') search?: string,
    @Query('category') category?: string,
  ) {
    const products = this.productsService.findAll(search, category);
    const categories = this.productsService.getCategories();

    return {
      data: products,
      meta: {
        total: products.length,
        categories: categories.map((c) => c.nombre),
      },
    };
  }

  @Get('products/:id')
  findOne(@Param('id') id: string) {
    const product = this.productsService.findOne(id);
    return { data: product };
  }

  @Get('categories')
  getCategories() {
    const categories = this.productsService.getCategories();
    return { data: categories };
  }

  @Get('health')
  healthCheck() {
    const stats = this.productsService.getStats();
    return {
      status: 'ok',
      ...stats,
    };
  }
}
