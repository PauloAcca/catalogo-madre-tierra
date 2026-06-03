import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { SheetsModule } from '../sheets/sheets.module';

@Module({
  imports: [SheetsModule],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
