import { Observable } from 'rxjs';

export interface Recipe {
  id?: number;
  name?: string;
  ingridients?: Ingridient[];
}

export interface Ingridient {
  id?: number;
  name?: string;
  portion?: string;
  nutrition?: Nutrition;
}

export interface Nutrition {
  ingridient?: Ingridient;
  calories?: string;
  fat?: string;
  sodium?: string;
  fiber?: string;
  sugar?: string;
  protein?: string;
}

export interface IngridientsList {
  ingridients: Ingridient[];
}

export interface IngridientsService {
  listIngridientsByRecipeId(recipe: Recipe): Observable<Ingridient[]>;
}
