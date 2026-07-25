import { Module, Global } from '@nestjs/common';
import { ConfigService } from './config.service';
import { ConfigController } from './config.controller';

@Global()
@Module({
  controllers: [ConfigController],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class AppConfigModule {}
