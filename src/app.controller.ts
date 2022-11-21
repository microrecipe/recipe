import { Get, Param } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly service: AppService) {}

  @Get('recipes/:id')
  async getRecipeById(@Param('id') id: number) {
    return await this.service.getRecipeById(
      {
        id,
      },
      'GRPC',
    );
  }

  @Get('recipes/tcp/:id')
  async _getRecipeById(@Param('id') id: number) {
    return await this.service.getRecipeById(
      {
        id,
      },
      'TCP',
    );
  }
}
