import { Observable } from 'rxjs';

export interface INutrition {
  id?: number;
  name?: string;
  perGram?: string;
  ingridientId?: number;
}

export interface IIngridient {
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
  ingridients?: IIngridient[];
}

export interface IngridientsData {
  id: number;
  quantity: number;
}

export interface AddRecipeData {
  name: string;
  ingridients: IngridientsData[];
}

export interface IngridientId {
  id: number;
}

export interface SetIngridient {
  id: number;
  quantity: number;
  recipeId: number;
}

export interface SetIngridientRes {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  nutritions: INutrition[];
}

export interface RecipeId {
  id: number;
}

export interface ListIngridientsRes {
  ingridients: IIngridient[];
}

export interface IngridientsService {
  setIngridientToRecipe(
    setIngridient: SetIngridient,
  ): Observable<SetIngridientRes>;

  getIngridientById(ingridientId: IngridientId): Observable<IIngridient>;

  listIngridientsByRecipeId(recipeId: RecipeId): Observable<ListIngridientsRes>;
}

export interface TokenPayload {
  id: number;
  name: string;
  email: string;
}

export type UserType = TokenPayload;
