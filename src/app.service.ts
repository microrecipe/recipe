import { OnModuleInit } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common/decorators/core/inject.decorator';
import { NotFoundException } from '@nestjs/common/exceptions/not-found.exception';
import { ClientGrpc } from '@nestjs/microservices';
import { IngridientsService, Recipe } from './recipes.interface';

const Recipes: Recipe[] = [
  {
    id: 1,
    name: 'Fried chicken',
    ingridients: null,
  },
];

@Injectable()
export class AppService implements OnModuleInit {
  private ingridientsService: IngridientsService;

  constructor(
    @Inject('INGRIDIENTS_PACKAGE')
    private client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.ingridientsService =
      this.client.getService<IngridientsService>('IngridientsService');
  }

  async getRecipeById(recipe: Recipe): Promise<Recipe> {
    const _recipe = Recipes.find((rcp) => rcp.id == recipe.id);

    if (!_recipe) {
      throw new NotFoundException('Recipe not found');
    }

    await this.ingridientsService
      .listIngridientsByRecipeId({
        id: _recipe.id,
      })
      .forEach((value) => {
        _recipe.ingridients = value;
      });

    return _recipe;
  }
}
