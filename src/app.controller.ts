import { Body, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { UserPayload } from './auth.decorator';
import { JwtAuthGuard } from './auth.guard';
import { AddRecipeBody, RecipesDTO } from './recipes.dto';
import { TokenPayload } from './recipes.interface';

@Controller()
export class AppController {
  constructor(private readonly service: AppService) {}

  @Get('recipes')
  async listRecipes(): Promise<RecipesDTO[]> {
    return await this.service.listRecipes();
  }

  @Post('recipes')
  @UseGuards(JwtAuthGuard)
  async addRecipe(
    @Body() body: AddRecipeBody,
    @UserPayload() user: TokenPayload,
  ): Promise<RecipesDTO> {
    return await this.service.addRecipe(body, user);
  }

  @Get('recipes/:id')
  async getRecipeById(@Param('id') id: number): Promise<RecipesDTO> {
    return await this.service.getRecipeById(id);
  }

  @Delete('recipes/:id')
  @UseGuards(JwtAuthGuard)
  async deleteRecipe(@Param('id') id: number): Promise<string> {
    return await this.service.deleteRecipe(id);
  }
}
