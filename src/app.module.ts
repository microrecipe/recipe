import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';
import { Transport } from '@nestjs/microservices/enums';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ClientsModule.register([
      {
        name: 'INGRIDIENTS_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'ingridients',
          protoPath: join(__dirname, '../src/ingridients.proto'),
          url: `${process.env.INGRIDIENT_HOST}:${process.env.INGRIDIENT_GRPC_PORT}`,
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
