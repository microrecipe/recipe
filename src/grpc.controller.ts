import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { GrpcService } from './grpc.service';
import { RecipeId, IRecipe } from './recipes.interface';

@Controller()
export class GrpcController {
  constructor(private readonly service: GrpcService) {}

  @GrpcMethod('RecipesService')
  async getRecipeById(data: RecipeId): Promise<IRecipe> {
    return await this.service.getRecipeById(data.id);
  }
}
