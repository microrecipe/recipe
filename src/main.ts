import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule);

  await app.listen(process.env.RECIPE_REST_PORT);

  logger.log(`HTTP service running on port: ${process.env.RECIPE_REST_PORT}`);
}
bootstrap();
