import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export interface AppConfig {
  globalShowPrices: boolean;
  productOverrides: Record<string, boolean>;
  imageOverrides: Record<string, string>;
}

@Injectable()
export class ConfigService implements OnModuleInit {
  private readonly logger = new Logger(ConfigService.name);
  private config: AppConfig = { globalShowPrices: false, productOverrides: {}, imageOverrides: {} };
  private readonly configPath = path.join(process.cwd(), 'data', 'config.json');

  onModuleInit() {
    this.loadConfig();
  }

  private loadConfig() {
    try {
      const dataDir = path.dirname(this.configPath);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      if (fs.existsSync(this.configPath)) {
        const fileData = fs.readFileSync(this.configPath, 'utf8');
        const parsed = JSON.parse(fileData);
        this.config = {
          globalShowPrices: parsed.globalShowPrices ?? false,
          productOverrides: parsed.productOverrides ?? {},
          imageOverrides: parsed.imageOverrides ?? {},
        };
      } else {
        this.saveConfig();
      }
    } catch (error) {
      this.logger.error('Failed to load config', error);
    }
  }

  private saveConfig() {
    try {
      fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 2), 'utf8');
    } catch (error) {
      this.logger.error('Failed to save config', error);
    }
  }

  getConfig(): AppConfig {
    return this.config;
  }

  updateGlobalShowPrices(show: boolean) {
    this.config.globalShowPrices = show;
    this.saveConfig();
    return this.config;
  }

  updateProductOverride(productId: string, show: boolean | null) {
    if (show === null) {
      delete this.config.productOverrides[productId];
    } else {
      this.config.productOverrides[productId] = show;
    }
    this.saveConfig();
    return this.config;
  }

  updateImageOverride(productId: string, imageUrl: string | null) {
    if (!this.config.imageOverrides) {
      this.config.imageOverrides = {};
    }
    if (!imageUrl) {
      delete this.config.imageOverrides[productId];
    } else {
      this.config.imageOverrides[productId] = imageUrl;
    }
    this.saveConfig();
    return this.config;
  }
}
