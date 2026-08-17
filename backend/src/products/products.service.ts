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

  findAll(search?: string, category?: string, includeHidden: boolean = false): Product[] {
    const config = this.configService.getConfig();
    const imageOverrides = config.imageOverrides || {};
    const hiddenProducts = config.hiddenProducts || {};
    const deletedProducts = config.deletedProducts || {};

    const rawProducts = this.sheetsService.getProducts().filter(p => !deletedProducts[p.id]);

    let products = rawProducts.map(p => {
      const override = config.productOverrides[p.id];
      const showPrice = override !== undefined ? override : config.globalShowPrices;
      const imagenUrl = imageOverrides[p.id] || p.imagenUrl || null;
      const isVisible = !hiddenProducts[p.id];
      return { ...p, showPrice, imagenUrl, isVisible };
    });

    if (!includeHidden) {
      products = products.filter((p) => p.isVisible);
    }

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

    return products;
  }

  findOne(id: string, includeHidden: boolean = false): Product {
    const config = this.configService.getConfig();
    if (config.deletedProducts?.[id]) {
      throw new NotFoundException(`Producto con id "${id}" no encontrado`);
    }

    const product = this.sheetsService
      .getProducts()
      .find((p) => p.id === id);

    if (!product) {
      throw new NotFoundException(`Producto con id "${id}" no encontrado`);
    }

    const override = config.productOverrides[product.id];
    const showPrice = override !== undefined ? override : config.globalShowPrices;
    const imageOverrides = config.imageOverrides || {};
    const imagenUrl = imageOverrides[product.id] || product.imagenUrl || null;
    const hiddenProducts = config.hiddenProducts || {};
    const isVisible = !hiddenProducts[product.id];

    if (!includeHidden && !isVisible) {
      throw new NotFoundException(`Producto con id "${id}" no encontrado`);
    }

    return { ...product, showPrice, imagenUrl, isVisible };
  }

  getCategories(includeHidden: boolean = false): CategoryInfo[] {
    const products = this.findAll(undefined, undefined, includeHidden);
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
    const categories = this.getCategories(true);
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
    const hiddenProducts = config.hiddenProducts || {};
    const isVisible = !hiddenProducts[updatedProduct.id];
    return { ...updatedProduct, showPrice, imagenUrl: imageUrl || null, isVisible };
  }

  async deleteProduct(id: string): Promise<boolean> {
    this.configService.markProductDeleted(id);
    return this.sheetsService.deleteProduct(id);
  }
}
