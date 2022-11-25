import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';
import { Transport } from '@nestjs/microservices/enums';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientPackageNames } from './package-names.enum';
import { Recipe } from './recipe.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ClientsModule.register([
      {
        name: ClientPackageNames.ingridientGRPC,
        transport: Transport.GRPC,
        options: {
          package: 'ingridients',
          protoPath: join(__dirname, '../src/ingridients.proto'),
          url: `${process.env.INGRIDIENT_HOST}:${process.env.INGRIDIENT_GRPC_PORT}`,
        },
      },
      {
        name: ClientPackageNames.ingridientTCP,
        transport: Transport.TCP,
        options: {
          host: process.env.INGRIDIENT_HOST,
          port: Number(process.env.INGRIDIENT_TCP_PORT),
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
