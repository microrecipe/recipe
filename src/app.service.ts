import { OnModuleInit } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common/decorators/core/inject.decorator';
import { NotFoundException } from '@nestjs/common/exceptions/not-found.exception';
import { ClientGrpc, ClientProxy } from '@nestjs/microservices';
import { ClientPackageNames } from './package-names.enum';
import {
  IngridientsList,
  IngridientsService,
  Recipe,
} from './recipes.interface';

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
    @Inject(ClientPackageNames.ingridientGRPC)
    private ingridientGrpcClient: ClientGrpc,
    @Inject(ClientPackageNames.ingridientTCP)
    private ingridientTcpClient: ClientProxy,
  ) {}

  async onModuleInit() {
    this.ingridientsService =
      this.ingridientGrpcClient.getService<IngridientsService>(
        'IngridientsService',
      );

    await this.ingridientTcpClient.connect();
  }

  async getRecipeById(
    recipe: Recipe,
    transportMethod?: 'GRPC' | 'TCP',
  ): Promise<Recipe> {
    const _recipe = Recipes.find((rcp) => rcp.id == recipe.id);

    if (!_recipe) {
      throw new NotFoundException('Recipe not found');
    }

    switch (transportMethod) {
      case 'GRPC': {
        await this.ingridientsService
          .listIngridientsByRecipeId({
            id: _recipe.id,
          })
          .forEach((value) => {
            _recipe.ingridients = value;
          });
        break;
      }
      case 'TCP': {
        await this.ingridientTcpClient
          .send<IngridientsList, Recipe>('listIngridients', {
            id: _recipe.id,
          })
          .forEach((value) => {
            _recipe.ingridients = value.ingridients;
          });
        break;
      }
      default:
        break;
    }

    return _recipe;
  }
}
