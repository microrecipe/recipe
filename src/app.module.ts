import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';
import { Transport } from '@nestjs/microservices/enums';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientPackageNames } from './package-names.enum';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
