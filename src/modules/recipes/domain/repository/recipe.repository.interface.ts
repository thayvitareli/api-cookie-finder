import { Recipe } from '../model/recipe.model';

export interface RecipeQuery {
  userId?: string;
  categoryId?: string;
  nameContains?: string;
  isPublic?: boolean;
  favoritedByUserId?: string;
}

export interface IRecipeRepository {
  create(recipe: Recipe): Promise<void>;
  findById(id: string): Promise<Recipe | null>;
  findAllByUser(userId: string): Promise<Recipe[]>;
  update(recipe: Recipe): Promise<void>;
  delete(id: string): Promise<void>;
  findMany(query: RecipeQuery, skip?: number, take?: number): Promise<Recipe[]>;
  total(query: RecipeQuery): Promise<number>;
  favorite(recipeId: string, userId: string): Promise<void>;
  unfavorite(recipeId: string, userId: string): Promise<void>;
  createEvaluation(
    recipeId: string,
    userId: string,
    stars: number,
    comment: string,
  ): Promise<void>;
  getEvaluationAverage(recipeId: string): Promise<number>;
  updateEvaluationAverage(recipeId: string, average: number): Promise<void>;
}
