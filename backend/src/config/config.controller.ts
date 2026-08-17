import { Controller, Get, Post, Body, Headers, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from './config.service';

@Controller('api/config')
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}

  @Get()
  getConfig() {
    return this.configService.getConfig();
  }

  @Post('global')
  updateGlobal(@Body('showPrices') showPrices: boolean, @Headers('authorization') auth: string) {
    this.verifyAuth(auth);
    return this.configService.updateGlobalShowPrices(showPrices);
  }

  @Post('product')
  updateProduct(
    @Body('productId') productId: string,
    @Body('showPrice') showPrice: boolean | null,
    @Headers('authorization') auth: string
  ) {
    this.verifyAuth(auth);
    return this.configService.updateProductOverride(productId, showPrice);
  }

  @Post('product-visibility')
  updateProductVisibility(
    @Body('productId') productId: string,
    @Body('visible') visible: boolean,
    @Headers('authorization') auth: string
  ) {
    this.verifyAuth(auth);
    return this.configService.updateProductVisibility(productId, visible);
  }

  @Post('verify')
  verifyPassword(@Headers('authorization') auth: string) {
    this.verifyAuth(auth);
    return { success: true };
  }

  private verifyAuth(auth: string) {
    if (!auth || !auth.startsWith('Bearer ')) {
      throw new UnauthorizedException('Falta token de autorización');
    }
    const token = auth.split(' ')[1];
    const adminPassword = process.env.ADMIN_PASSWORD || 'madretierra2024';
    if (token !== adminPassword) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }
  }
}
