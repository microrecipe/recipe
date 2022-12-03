import { INutrition, IIngredient, IRecipe } from './recipes.interface';

export class IngredientsBody {
  id: number;
  quantity: number;
}

export class AddRecipeBody {
  name: string;
  ingredients: IngredientsBody[];
}

export class NutritionsDTO {
  static toDTO(nutrition: INutrition) {
    const res = new NutritionsDTO();

    res.id = nutrition.id;
    res.name = nutrition.name;
    res.per_gram = nutrition.perGram;

    return res;
  }

  id: number;
  name: string;
  per_gram: string;
}

export class IngredientsDTO {
  static toDTO(ingredient: IIngredient) {
    const res = new IngredientsDTO();

    res.id = ingredient.id;
    res.name = ingredient.name;
    res.quantity = ingredient.quantity;
    res.unit = ingredient.unit;
    res.nutritions = ingredient.nutritions
      ? ingredient.nutritions.map((nutrition) => NutritionsDTO.toDTO(nutrition))
      : [];

    return res;
  }

  id: number;
  name: string;
  quantity: number;
  unit: string;
  nutritions: NutritionsDTO[];
}

export class RecipesDTO {
  static toDTO(recipe: IRecipe) {
    const res = new RecipesDTO();

    res.id = recipe.id;
    res.name = recipe.name;
    res.ingredients = recipe.ingredients?.map((ingredient) =>
      IngredientsDTO.toDTO(ingredient),
    );

    return res;
  }
  id: number;
  name: string;
  ingredients: IngredientsDTO[];
}
