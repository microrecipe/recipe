import { Logger } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common/pipes';
import { NestFactory } from '@nestjs/core';
import { KafkaOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  app.connectMicroservice<KafkaOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'microrecipe',
        brokers: process.env.KAFKA_BROKERS.split(','),
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
