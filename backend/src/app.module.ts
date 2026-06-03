import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ProductsModule,
  ],
})
export class AppModule {}
