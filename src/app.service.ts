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
    ingridients: [
      {
        id: 1,
      },
      {
        id: 2,
      },
    ],
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

    const ingridients = [];

    for (let i = 0; i < _recipe.ingridients.length; i++) {
      await this.ingridientsService
        .getIngridientById({
          id: _recipe.ingridients[i].id,
        })
        .forEach((value) => {
          ingridients.push(value);
        });
    }

    _recipe.ingridients = ingridients;

    return _recipe;
  }
}
