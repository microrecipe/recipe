import { Body, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { UserPayload } from './auth/auth.decorator';
import { JwtAuthGuard } from './auth/auth.guard';
import { AddRecipeBody, RecipesDTO } from './recipes.dto';
import { UserType } from './recipes.interface';

@Controller('recipes')
export class AppController {
  constructor(private readonly service: AppService) {}

  @Get()
  async listRecipes(): Promise<RecipesDTO[]> {
    return await this.service.listRecipes();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async addRecipe(
    @Body() body: AddRecipeBody,
    @UserPayload() user: UserType,
  ): Promise<RecipesDTO> {
    return await this.service.addRecipe(body, user);
  }

  @Get(':id')
  async getRecipeById(@Param('id') id: number): Promise<RecipesDTO> {
    return await this.service.getRecipeById(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteRecipe(@Param('id') id: number): Promise<string> {
    return await this.service.deleteRecipe(id);
  }
}
