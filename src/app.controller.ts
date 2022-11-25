import { Body, Get, Param, Post } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { AddRecipeBody, RecipesDTO } from './recipes.dto';

@Controller()
export class AppController {
  constructor(private readonly service: AppService) {}

  @Get('recipes')
  async listRecipes(): Promise<RecipesDTO[]> {
    return await this.service.listRecipes();
  }

  @Post('recipes')
  async addRecipe(@Body() body: AddRecipeBody): Promise<RecipesDTO> {
    return await this.service.addRecipe(body);
  }

  @Get('recipes/:id')
  async getRecipeById(@Param('id') id: number): Promise<RecipesDTO> {
    return await this.service.getRecipeById(id);
  }
}
