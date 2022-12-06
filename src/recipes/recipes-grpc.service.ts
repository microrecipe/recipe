import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientGrpc, ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recipe } from '../entities/recipe.entity';
import { ClientPackageNames } from '../recipes.enum';
import { IngredientsService, IRecipe } from '../recipes.interface';

@Injectable()
export class RecipesGrpcService implements OnModuleInit {
  private ingredientsService: IngredientsService;
  private logger = new Logger('RecipesService');

  constructor(
    @Inject(ClientPackageNames.ingredientGRPC)
    private ingredientGrpcClient: ClientGrpc,
    @Inject(ClientPackageNames.ingredientTCP)
    private ingredientTcpClient: ClientProxy,
    @InjectRepository(Recipe)
    private recipesRepository: Repository<Recipe>,
  ) {}

  onModuleInit() {
    this.ingredientsService =
      this.ingredientGrpcClient.getService<IngredientsService>(
        'IngredientsService',
      );
  }

  async getRecipeById(id: number): Promise<IRecipe> {
    const recipe = await this.recipesRepository.findOneByOrFail({
      id,
    });

    let _recipe: IRecipe;

    await this.ingredientsService
      .listIngredientsByRecipeId({
        id: recipe.id,
      })
      .forEach((val) => {
        _recipe = { ...recipe, ingredients: val.ingredients };
      });

    return _recipe;
  }
}
