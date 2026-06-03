import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  // CORS configuration
  const allowedOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',')
    : ['http://localhost:3000'];

  app.enableCors({
    origin: allowedOrigins,
    methods: ['GET'],
    credentials: false,
  });

  const port = process.env.PORT || 3001;
  await app.listen(port);
  logger.log(`🌿 Madre Tierra API running on port ${port}`);
}
bootstrap();
