import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule } from '@nestjs/microservices';
import { Transport } from '@nestjs/microservices/enums';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { RecipesController } from './recipes/recipes.controller';
import { JwtStrategy } from './auth/jwt.strategy';
import { ClientPackageNames } from './recipes.enum';
import { Recipe } from './entities/recipe.entity';
import { RecipesGrpcController } from './recipes/recipes-grpc.controller';
import { RecipesService } from './recipes/recipes.service';
import { RecipesGrpcService } from './recipes/recipes-grpc.service';

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
        entities: [__dirname + './**/*.entity{.ts,.js}'],
        autoLoadEntities: true,
        synchronize: true,
        logging: false,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Recipe]),
    JwtModule,
  ],
  controllers: [RecipesController, RecipesGrpcController],
  providers: [RecipesService, JwtStrategy, RecipesGrpcService],
})
export class AppModule {}
