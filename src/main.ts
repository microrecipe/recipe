import { Logger } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common/pipes';
import { NestFactory } from '@nestjs/core';
import { GrpcOptions, KafkaOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
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

  app.connectMicroservice<GrpcOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'recipes',
      protoPath: join(__dirname, '../src/proto/recipes.proto'),
      url: `${process.env.RECIPE_HOST}:${process.env.RECIPE_GRPC_PORT}`,
    },
  });

  app.startAllMicroservices().then(() => {
    logger.log(`gRPC service running on port: ${process.env.RECIPE_GRPC_PORT}`);
  });

  await app.listen(process.env.RECIPE_REST_PORT);

  logger.log(`HTTP service running on port: ${process.env.RECIPE_REST_PORT}`);
}
bootstrap();
