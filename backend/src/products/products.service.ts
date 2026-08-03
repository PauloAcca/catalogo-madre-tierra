import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SheetsService } from '../sheets/sheets.service';
import { ConfigService } from '../config/config.service';
import { Product, CategoryInfo } from './interfaces/product.interface';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    private readonly sheetsService: SheetsService,
    private readonly configService: ConfigService,
  ) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async handleCron() {
    this.logger.log('Refreshing products data from Google Sheets...');
    await this.sheetsService.refreshData();
    this.logger.log('Products data refreshed');
  }

  findAll(search?: string, category?: string): Product[] {
    let products = this.sheetsService.getProducts();

    if (category) {
      products = products.filter(
        (p) => p.categoria.toLowerCase() === category.toLowerCase(),
      );
    }

    if (search) {
      const searchLower = search.toLowerCase().trim();
      products = products.filter(
        (p) =>
          p.nombre.toLowerCase().includes(searchLower) ||
          p.categoria.toLowerCase().includes(searchLower),
      );
    }

    const config = this.configService.getConfig();
    const imageOverrides = config.imageOverrides || {};

    return products.map(p => {
      const override = config.productOverrides[p.id];
      const showPrice = override !== undefined ? override : config.globalShowPrices;
      const imagenUrl = imageOverrides[p.id] || p.imagenUrl || null;
      return { ...p, showPrice, imagenUrl };
    });
  }

  findOne(id: string): Product {
    const product = this.sheetsService
      .getProducts()
      .find((p) => p.id === id);

    if (!product) {
      throw new NotFoundException(`Producto con id "${id}" no encontrado`);
    }

    const config = this.configService.getConfig();
    const override = config.productOverrides[product.id];
    const showPrice = override !== undefined ? override : config.globalShowPrices;
    const imageOverrides = config.imageOverrides || {};
    const imagenUrl = imageOverrides[product.id] || product.imagenUrl || null;

    return { ...product, showPrice, imagenUrl };
  }

  getCategories(): CategoryInfo[] {
    const products = this.sheetsService.getProducts();
    const categoryMap = new Map<string, number>();

    for (const product of products) {
      const count = categoryMap.get(product.categoria) || 0;
      categoryMap.set(product.categoria, count + 1);
    }

    return Array.from(categoryMap.entries()).map(([nombre, cantidad]) => ({
      nombre,
      cantidad,
    }));
  }

  getStats() {
    const products = this.sheetsService.getProducts();
    const categories = this.getCategories();
    return {
      totalProducts: products.length,
      totalCategories: categories.length,
      lastSync: this.sheetsService.getLastFetchTime(),
    };
  }

  async updateProductImage(id: string, imageUrl: string): Promise<Product> {
    this.configService.updateImageOverride(id, imageUrl);
    const updatedProduct = await this.sheetsService.updateProductImage(id, imageUrl);
    const config = this.configService.getConfig();
    const override = config.productOverrides[updatedProduct.id];
    const showPrice = override !== undefined ? override : config.globalShowPrices;
    return { ...updatedProduct, showPrice, imagenUrl: imageUrl || null };
  }
}
