import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { RecipeId, IRecipe } from '../recipes.interface';
import { RecipesGrpcService } from './recipes-grpc.service';

@Controller()
export class RecipesGrpcController {
  constructor(private readonly service: RecipesGrpcService) {}

  @GrpcMethod('RecipesService')
  async getRecipeById(data: RecipeId): Promise<IRecipe> {
    return await this.service.getRecipeById(data.id);
  }
}
