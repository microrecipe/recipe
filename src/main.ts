import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('recipes');

  const app = await NestFactory.create(AppModule);

  await app.listen(3011);

  logger.warn(`recipes app running on port: ${3011}`);
}
bootstrap();
