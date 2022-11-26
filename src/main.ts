import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { KafkaOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<KafkaOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['broker:29092'],
      },
      consumer: {
        groupId: 'recipe',
      },
    },
  });

  await app.startAllMicroservices();

  await app.listen(process.env.RECIPE_REST_PORT);

  logger.log(`HTTP service running on port: ${process.env.RECIPE_REST_PORT}`);
}
bootstrap();
