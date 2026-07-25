import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from './products/products.module';
import { AppConfigModule } from './config/config.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    ProductsModule,
    AppConfigModule,
  ],
})
export class AppModule {}
