import { NotFoundException, OnModuleInit } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common/decorators/core/inject.decorator';
import { ClientGrpc, ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientPackageNames } from './package-names.enum';
import { Recipe } from './recipe.entity';
import { RecipesDTO } from './recipes.dto';
import {
  AddRecipeData,
  IIngridient,
  IngridientsService,
  IRecipe,
} from './recipes.interface';

@Injectable()
export class AppService implements OnModuleInit {
  private ingridientsService: IngridientsService;

  constructor(
    @Inject(ClientPackageNames.ingridientGRPC)
    private ingridientGrpcClient: ClientGrpc,
    @Inject(ClientPackageNames.ingridientTCP)
    private ingridientTcpClient: ClientProxy,
    @InjectRepository(Recipe)
    private recipesRepository: Repository<Recipe>,
  ) {}

  onModuleInit() {
    this.ingridientsService =
      this.ingridientGrpcClient.getService<IngridientsService>(
        'IngridientsService',
      );
  }

  async addRecipe(data: AddRecipeData): Promise<RecipesDTO> {
    for (const ing of data.ingridients) {
      await this.ingridientsService
        .getIngridientById({
          id: ing.id,
        })
        .forEach((val) => {
          if (!val) {
            throw new NotFoundException('Ingridient not found');
          }
        });
    }

    const recipe = this.recipesRepository.create({
      name: data.name,
    });

    await this.recipesRepository.save(recipe);

    const ingridients: IIngridient[] = [];

    for (const ing of data.ingridients) {
      await this.ingridientsService
        .setIngridientToRecipe({
          id: ing.id,
          portion: ing.portion,
          recipeId: recipe.id,
        })
        .forEach((val) => {
          ingridients.push(val);
        });
    }

    return RecipesDTO.toDTO({ ...recipe, ingridients });
  }

  async listRecipes() {
    const recipes = await this.recipesRepository.find();

    const recipesList: IRecipe[] = [];

    for (const recipe of recipes) {
      await this.ingridientsService
        .listIngridientsByRecipeId({
          id: recipe.id,
        })
        .forEach((val) => {
          recipesList.push({ ...recipe, ingridients: val.ingridients });
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

    let ingridients;

    await this.ingridientsService
      .listIngridientsByRecipeId({
        id: recipe.id,
      })
      .forEach((val) => {
        ingridients = val.ingridients;
      });

    return RecipesDTO.toDTO({
      ...recipe,
      ingridients,
    });
  }
}
