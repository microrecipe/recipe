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
  portion?: string;
  recipeId?: number;
  nutritions?: INutrition[];
}

export interface IRecipe {
  id?: number;
  name?: string;
  ingridients?: IIngridient[];
}

export interface IngridientsData {
  id: number;
  portion: string;
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
  portion: string;
  recipeId: number;
}

export interface SetIngridientRes {
  id: number;
  name: string;
  portion: string;
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
