import { Get, Param } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly service: AppService) {}

  @Get('recipe/:id')
  async getRecipeById(@Param('id') id: number) {
    return await this.service.getRecipeById({
      id,
    });
  }
}
