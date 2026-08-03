import { Injectable, Logger, OnModuleInit, NotFoundException } from '@nestjs/common';
import { google, sheets_v4 } from 'googleapis';
import { Product } from '../products/interfaces/product.interface';

@Injectable()
export class SheetsService implements OnModuleInit {
  private readonly logger = new Logger(SheetsService.name);
  private sheets: sheets_v4.Sheets;
  private cachedProducts: Product[] = [];
  private lastFetchTime: Date | null = null;

  async onModuleInit() {
    await this.initializeClient();
    await this.refreshData();
  }

  private async initializeClient() {
    const credentialsJson = process.env.GOOGLE_CREDENTIALS_JSON;

    if (!credentialsJson) {
      this.logger.warn(
        'GOOGLE_CREDENTIALS_JSON not set. Using mock data for development.',
      );
      return;
    }

    try {
      const credentials = JSON.parse(credentialsJson);
      const auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
      });

      this.sheets = google.sheets({ version: 'v4', auth });
      this.logger.log('Google Sheets client initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize Google Sheets client', error);
    }
  }

  async refreshData(): Promise<void> {
    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;

    if (!this.sheets || !spreadsheetId) {
      this.logger.warn('Sheets client or spreadsheet ID not available. Using mock data.');
      this.cachedProducts = this.getMockProducts();
      this.lastFetchTime = new Date();
      return;
    }

    try {
      // Step 1: Get spreadsheet metadata to discover all tabs/sheets
      const spreadsheet = await this.sheets.spreadsheets.get({
        spreadsheetId,
        fields: 'sheets.properties.title',
      });

      const sheetNames =
        spreadsheet.data.sheets
          ?.map((s) => s.properties?.title)
          .filter((title): title is string => !!title && title.toLowerCase().trim().startsWith('costos')) ?? [];

      this.logger.log(`Found ${sheetNames.length} sheets: ${sheetNames.join(', ')}`);

      // Step 2: Batch-read all sheets
      const ranges = sheetNames.map((name) => `'${name}'!A:Z`);
      const batchResponse = await this.sheets.spreadsheets.values.batchGet({
        spreadsheetId,
        ranges,
      });

      // Step 3: Parse each sheet into products
      const allProducts: Product[] = [];

      for (let i = 0; i < sheetNames.length; i++) {
        const sheetName = sheetNames[i];
        const valueRange = batchResponse.data.valueRanges?.[i];
        const rows = valueRange?.values;

        if (!rows || rows.length < 2) {
          this.logger.warn(`Sheet "${sheetName}" is empty or has no data rows`);
          continue;
        }

        const headers = rows[0].map((h: string) =>
          String(h).trim().toLowerCase(),
        );
        const articuloIdx = headers.findIndex(
          (h: string) => h === 'articulo' || h === 'artículo',
        );
        const precioIdx = headers.findIndex(
          (h: string) =>
            h.includes('precio') && h.includes('venta'),
        );
        const imgIdx = headers.findIndex(
          (h: string) => h === 'imgurl' || h === 'img' || h === 'imagen',
        );

        if (articuloIdx === -1) {
          this.logger.warn(
            `Sheet "${sheetName}" has no "Articulo" column. Skipping.`,
          );
          continue;
        }

        for (let rowIdx = 1; rowIdx < rows.length; rowIdx++) {
          const row = rows[rowIdx];
          const nombre = row[articuloIdx]
            ? String(row[articuloIdx]).trim()
            : '';

          if (!nombre) continue;

          const precioRaw =
            precioIdx !== -1 && row[precioIdx]
              ? String(row[precioIdx]).trim()
              : null;
          const precio = precioRaw
            ? parseFloat(precioRaw.replace(/[^0-9.,]/g, '').replace(',', '.'))
            : null;

          const imagenUrl =
            imgIdx !== -1 && row[imgIdx]
              ? String(row[imgIdx]).trim()
              : null;

          const imgColLetter = imgIdx !== -1 ? this.colIndexToLetter(imgIdx) : '';
          const categoriaClean = sheetName.replace(/^Costos\s+/i, '').trim();
          const id = this.generateId(categoriaClean, nombre, rowIdx);

          allProducts.push({
            id,
            nombre,
            categoria: categoriaClean,
            precio: precio && !isNaN(precio) ? precio : null,
            imagenUrl: imagenUrl || null,
            _meta: {
              sheetName,
              rowNumber: rowIdx + 1,
              imgColLetter,
            },
          });
        }

        this.logger.log(
          `Parsed ${allProducts.filter((p) => p._meta?.sheetName === sheetName).length} products from "${sheetName}"`,
        );
      }

      this.cachedProducts = allProducts;
      this.lastFetchTime = new Date();
      this.logger.log(
        `Total products cached: ${allProducts.length} from ${sheetNames.length} categories`,
      );
    } catch (error) {
      this.logger.error('Failed to refresh data from Google Sheets', error);
      // Keep existing cache if refresh fails
      if (this.cachedProducts.length === 0) {
        this.cachedProducts = this.getMockProducts();
      }
    }
  }

  getProducts(): Product[] {
    return this.cachedProducts;
  }

  getLastFetchTime(): Date | null {
    return this.lastFetchTime;
  }

  async updateProductImage(productId: string, imageUrl: string): Promise<Product> {
    const product = this.cachedProducts.find((p) => p.id === productId);
    if (!product) {
      throw new NotFoundException(`Producto con ID ${productId} no encontrado`);
    }

    product.imagenUrl = imageUrl;

    const meta = product._meta;
    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;

    if (meta && meta.imgColLetter && this.sheets && spreadsheetId) {
      const range = `'${meta.sheetName}'!${meta.imgColLetter}${meta.rowNumber}`;
      try {
        await this.sheets.spreadsheets.values.update({
          spreadsheetId,
          range,
          valueInputOption: 'USER_ENTERED',
          requestBody: {
            values: [[imageUrl]],
          },
        });
      } catch (error) {
        this.logger.warn(`No se pudo actualizar en Google Sheets (${range}), pero se guardó localmente.`, error?.message || error);
      }
    } else {
      this.logger.warn(`Sheet metadata or imgURL column missing for product ${productId}, saved in local config override.`);
    }

    return product;
  }

  private colIndexToLetter(index: number): string {
    let letter = '';
    let temp = index;
    while (temp >= 0) {
      letter = String.fromCharCode((temp % 26) + 65) + letter;
      temp = Math.floor(temp / 26) - 1;
    }
    return letter;
  }

  private generateId(categoria: string, nombre: string, index: number): string {
    const slug = `${categoria}-${nombre}`
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    return `${slug}-${index}`;
  }

  private getMockProducts(): Product[] {
    return [
      // Frutas
      { id: 'frutas-manzana-verde-1', nombre: 'Manzana Verde', categoria: 'Frutas', precio: 1500, imagenUrl: null },
      { id: 'frutas-banana-2', nombre: 'Banana', categoria: 'Frutas', precio: 1200, imagenUrl: null },
      { id: 'frutas-naranja-3', nombre: 'Naranja de Jugo', categoria: 'Frutas', precio: 1800, imagenUrl: null },
      { id: 'frutas-pera-4', nombre: 'Pera Williams', categoria: 'Frutas', precio: 2000, imagenUrl: null },
      { id: 'frutas-mandarina-5', nombre: 'Mandarina', categoria: 'Frutas', precio: 1600, imagenUrl: null },
      { id: 'frutas-kiwi-6', nombre: 'Kiwi', categoria: 'Frutas', precio: 3500, imagenUrl: null },
      // Verduras
      { id: 'verduras-tomate-1', nombre: 'Tomate Redondo', categoria: 'Verduras', precio: 2200, imagenUrl: null },
      { id: 'verduras-lechuga-2', nombre: 'Lechuga Mantecosa', categoria: 'Verduras', precio: 1000, imagenUrl: null },
      { id: 'verduras-zanahoria-3', nombre: 'Zanahoria', categoria: 'Verduras', precio: 900, imagenUrl: null },
      { id: 'verduras-cebolla-4', nombre: 'Cebolla', categoria: 'Verduras', precio: 800, imagenUrl: null },
      { id: 'verduras-papa-5', nombre: 'Papa', categoria: 'Verduras', precio: 1100, imagenUrl: null },
      { id: 'verduras-repollo-colorado-6', nombre: 'Repollo Colorado', categoria: 'Verduras', precio: 1400, imagenUrl: null },
      // Almacén
      { id: 'almacen-arroz-integral-1', nombre: 'Arroz Integral', categoria: 'Almacén', precio: 2500, imagenUrl: null },
      { id: 'almacen-granola-2', nombre: 'Granola Artesanal', categoria: 'Almacén', precio: 4500, imagenUrl: null },
      { id: 'almacen-miel-3', nombre: 'Miel Pura', categoria: 'Almacén', precio: 6000, imagenUrl: null },
      { id: 'almacen-avena-arrollada-4', nombre: 'Avena Arrollada', categoria: 'Almacén', precio: 2000, imagenUrl: null },
      { id: 'almacen-aceite-oliva-5', nombre: 'Aceite de Oliva Extra Virgen', categoria: 'Almacén', precio: 8500, imagenUrl: null },
      { id: 'almacen-yerba-organica-6', nombre: 'Yerba Orgánica', categoria: 'Almacén', precio: 5500, imagenUrl: null },
      // Dietética
      { id: 'dietetica-semillas-chia-1', nombre: 'Semillas de Chía', categoria: 'Dietética', precio: 3000, imagenUrl: null },
      { id: 'dietetica-levadura-nutricional-2', nombre: 'Levadura Nutricional', categoria: 'Dietética', precio: 4000, imagenUrl: null },
      { id: 'dietetica-leche-almendras-3', nombre: 'Leche de Almendras', categoria: 'Dietética', precio: 3800, imagenUrl: null },
      { id: 'dietetica-proteina-vegana-4', nombre: 'Proteína Vegana', categoria: 'Dietética', precio: 12000, imagenUrl: null },
      // Congelados
      { id: 'congelados-empanadas-1', nombre: 'Empanadas Integrales', categoria: 'Congelados', precio: 5000, imagenUrl: null },
      { id: 'congelados-hamburguesas-lentejas-2', nombre: 'Hamburguesas de Lentejas', categoria: 'Congelados', precio: 4500, imagenUrl: null },
      // Bebidas
      { id: 'bebidas-jugo-natural-1', nombre: 'Jugo Natural de Naranja', categoria: 'Bebidas', precio: 3500, imagenUrl: null },
      { id: 'bebidas-kombucha-2', nombre: 'Kombucha Artesanal', categoria: 'Bebidas', precio: 5000, imagenUrl: null },
    ];
  }
}
