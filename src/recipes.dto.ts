import { INutrition, IIngridient, IRecipe } from './recipes.interface';

export class IngridientsBody {
  id: number;
  quantity: number;
}

export class AddRecipeBody {
  name: string;
  ingridients: IngridientsBody[];
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

export class IngridientsDTO {
  static toDTO(ingridient: IIngridient) {
    const res = new IngridientsDTO();

    res.id = ingridient.id;
    res.name = ingridient.name;
    res.quantity = ingridient.quantity;
    res.unit = ingridient.unit;
    res.nutritions = ingridient.nutritions
      ? ingridient.nutritions.map((nutrition) => NutritionsDTO.toDTO(nutrition))
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
    res.ingridients = recipe.ingridients.map((ingridient) =>
      IngridientsDTO.toDTO(ingridient),
    );

    return res;
  }
  id: number;
  name: string;
  ingridients: IngridientsDTO[];
}
