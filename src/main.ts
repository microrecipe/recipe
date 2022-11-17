import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('recipes');

  const app = await NestFactory.create(AppModule);

  await app.listen(process.env.RECIPE_REST_PORT);

  logger.verbose(
    `recipes app running on port: ${process.env.RECIPE_REST_PORT}`,
  );
}
bootstrap();
