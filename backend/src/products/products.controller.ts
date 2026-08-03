import { Controller, Get, Param, Query, Body, Patch, Headers, UnauthorizedException, HttpException, HttpStatus } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ConfigService } from '../config/config.service';

@Controller('api')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly configService: ConfigService,
  ) {}

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
        globalShowPrices: this.configService.getConfig().globalShowPrices,
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

  @Patch('products/:id/image')
  async updateImage(
    @Param('id') id: string,
    @Body() body: any,
    @Headers('authorization') authHeader: string,
  ) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token no provisto');
    }

    const token = authHeader.split(' ')[1];
    const adminPassword = process.env.ADMIN_PASSWORD || 'MadreTierra2026';

    if (token !== adminPassword) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    const rawUrl = body?.imageUrl;
    const targetUrl = typeof rawUrl === 'string' ? rawUrl.trim() : '';

    try {
      const product = await this.productsService.updateProductImage(id, targetUrl);
      return { data: product, message: targetUrl ? 'Imagen actualizada exitosamente' : 'Imagen eliminada exitosamente' };
    } catch (err: any) {
      throw new HttpException(err?.message || 'Error al actualizar imagen', HttpStatus.BAD_REQUEST);
    }
  }
}
