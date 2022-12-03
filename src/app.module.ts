import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule } from '@nestjs/microservices';
import { Transport } from '@nestjs/microservices/enums';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtStrategy } from './auth/jwt.strategy';
import { GrpcController } from './grpc.controller';
import { GrpcService } from './grpc.service';
import { ClientPackageNames } from './package-names.enum';
import { Recipe } from './recipe.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ClientsModule.register([
      {
        name: ClientPackageNames.ingredientGRPC,
        transport: Transport.GRPC,
        options: {
          package: 'ingredients',
          protoPath: join(__dirname, '../src/proto/ingredients.proto'),
          url: `${process.env.INGREDIENT_HOST}:${process.env.INGREDIENT_GRPC_PORT}`,
        },
      },
      {
        name: ClientPackageNames.ingredientTCP,
        transport: Transport.TCP,
        options: {
          host: process.env.INGREDIENT_HOST,
          port: Number(process.env.INGREDIENT_TCP_PORT),
        },
      },
      {
        name: ClientPackageNames.recipeDeleteTopic,
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'microrecipe',
            brokers: process.env.KAFKA_BROKERS.split(','),
          },
        },
      },
    ]),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('RECIPE_DB_HOST'),
        port: Number(configService.get('RECIPE_DB_PORT')),
        username: configService.get('RECIPE_DB_USERNAME'),
        password: configService.get('RECIPE_DB_PASSWORD'),
        database: configService.get('RECIPE_DB_NAME'),
        entities: [__dirname + './*.entity{.ts,.js}'],
        autoLoadEntities: true,
        synchronize: true,
        logging: false,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Recipe]),
    JwtModule,
  ],
  controllers: [AppController, GrpcController],
  providers: [AppService, JwtStrategy, GrpcService],
})
export class AppModule {}
