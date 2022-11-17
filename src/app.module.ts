import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { Transport } from '@nestjs/microservices/enums';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'INGRIDIENTS_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'ingridients',
          protoPath: join(__dirname, '../src/ingridients.proto'),
          url: 'localhost:3008',
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
