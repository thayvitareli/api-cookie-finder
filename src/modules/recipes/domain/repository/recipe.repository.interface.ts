import { Recipe } from '../model/recipe.model';

export interface RecipeQuery {
  userId?: string;
  categoryId?: string;
  nameContains?: string;
  isPublic?: boolean;
}

export interface IRecipeRepository {
  create(recipe: Recipe): Promise<void>;
  findById(id: string): Promise<Recipe | null>;
  findAllByUser(userId: string): Promise<Recipe[]>;
  update(recipe: Recipe): Promise<void>;
  delete(id: string): Promise<void>;
  findMany(query: RecipeQuery, skip?: number, take?: number): Promise<Recipe[]>;
  total(query: RecipeQuery): Promise<number>;
}
