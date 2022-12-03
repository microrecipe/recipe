import { NotFoundException, OnModuleInit } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common/decorators/core/inject.decorator';
import { Logger } from '@nestjs/common/services';
import { ClientGrpc, ClientKafka, ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientPackageNames } from './package-names.enum';
import { Recipe } from './recipe.entity';
import { RecipesDTO } from './recipes.dto';
import {
  AddRecipeData,
  IIngredient,
  IngredientsService as IngredientsService,
  IRecipe,
  UserType,
} from './recipes.interface';

@Injectable()
export class AppService implements OnModuleInit {
  private ingredientsService: IngredientsService;
  private logger = new Logger('RecipesService');

  constructor(
    @Inject(ClientPackageNames.ingredientGRPC)
    private ingredientGrpcClient: ClientGrpc,
    @Inject(ClientPackageNames.ingredientTCP)
    private ingredientTcpClient: ClientProxy,
    @Inject(ClientPackageNames.recipeDeleteTopic)
    private recipeDeleteKafka: ClientKafka,
    @InjectRepository(Recipe)
    private recipesRepository: Repository<Recipe>,
  ) {}

  onModuleInit() {
    this.ingredientsService =
      this.ingredientGrpcClient.getService<IngredientsService>(
        'IngredientsService',
      );
  }

  async addRecipe(data: AddRecipeData, user: UserType): Promise<RecipesDTO> {
    for (const ing of data.ingredients) {
      await this.ingredientsService
        .getIngredientById({
          id: ing.id,
        })
        .forEach((val) => {
          if (!val) {
            throw new NotFoundException('ingredient not found');
          }
        });
    }

    const recipe = await this.recipesRepository.save(
      this.recipesRepository.create({
        name: data.name,
        userId: user.id,
      }),
    );

    const ingredients: IIngredient[] = [];

    for (const ing of data.ingredients) {
      await this.ingredientsService
        .setIngredientToRecipe({
          id: ing.id,
          quantity: ing.quantity,
          recipeId: recipe.id,
        })
        .forEach((val) => {
          ingredients.push(val);
        });
    }

    return RecipesDTO.toDTO({ ...recipe, ingredients: ingredients });
  }

  async listRecipes(): Promise<RecipesDTO[]> {
    const recipes = await this.recipesRepository.find();

    const recipesList: IRecipe[] = [];

    for (const recipe of recipes) {
      await this.ingredientsService
        .listIngredientsByRecipeId({
          id: recipe.id,
        })
        .forEach((val) => {
          recipesList.push({ ...recipe, ingredients: val.ingredients });
        });
    }

    return recipesList.map((recipe) => RecipesDTO.toDTO(recipe));
  }

  async getRecipeById(id: number): Promise<RecipesDTO> {
    const recipe = await this.recipesRepository.findOne({
      where: {
        id,
      },
    });

    if (!recipe) {
      throw new NotFoundException('Recipe not found');
    }

    let ingredients;

    await this.ingredientsService
      .listIngredientsByRecipeId({
        id: recipe.id,
      })
      .forEach((val) => {
        ingredients = val.ingredients;
      });

    return RecipesDTO.toDTO({
      ...recipe,
      ingredients: ingredients,
    });
  }

  async deleteRecipe(id: number): Promise<string> {
    const recipe = await this.recipesRepository.findOne({
      where: {
        id,
      },
    });

    if (!recipe) {
      throw new NotFoundException('Recipe not found');
    }

    await this.recipesRepository.remove(recipe);

    this.recipeDeleteKafka
      .emit('recipe.deleted', { recipe_id: id })
      .forEach(() => {
        this.logger.log('recipe.deleted emit');
      });

    return 'Recipe deleted';
  }
}
