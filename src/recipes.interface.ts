import { Observable } from 'rxjs';

export interface INutrition {
  id?: number;
  name?: string;
  perGram?: string;
  ingredientId?: number;
}

export interface IIngredient {
  id?: number;
  name?: string;
  quantity?: number;
  unit?: string;
  nutritions?: INutrition[];
  recipeId?: number;
}

export interface IRecipe {
  id?: number;
  name?: string;
  ingredients?: IIngredient[];
}

export interface IngredientsData {
  id: number;
  quantity: number;
}

export interface AddRecipeData {
  name: string;
  ingredients: IngredientsData[];
}

export interface IngredientId {
  id: number;
}

export interface SetIngredient {
  id: number;
  quantity: number;
  recipeId: number;
}

export interface SetIngredientRes {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  nutritions: INutrition[];
}

export interface RecipeId {
  id: number;
}

export interface ListIngredientsRes {
  ingredients: IIngredient[];
}

export interface IngredientsService {
  setIngredientToRecipe(
    setIngredient: SetIngredient,
  ): Observable<SetIngredientRes>;

  getIngredientById(ingredientId: IngredientId): Observable<IIngredient>;

  listIngredientsByRecipeId(recipeId: RecipeId): Observable<ListIngredientsRes>;
}

export interface TokenPayload {
  id: number;
  name: string;
  email: string;
}

export type UserType = TokenPayload;
