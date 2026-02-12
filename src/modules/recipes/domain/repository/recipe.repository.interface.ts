import { Recipe } from '../model/recipe.model';
import { RecipeEvaluation } from '../model/recipe-evaluation.model';

export interface RecipeQuery {
  userId?: string;
  categoryId?: string;
  nameContains?: string;
  isPublic?: boolean;
  favoritedByUserId?: string;
  categoryCode?: string;
  minCreatedAt?: Date;
  orderBy?: 'top_rated' | 'newest';
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
  findEvaluations(
    recipeId: string,
    skip?: number,
    take?: number,
  ): Promise<RecipeEvaluation[]>;
  totalEvaluations(recipeId: string): Promise<number>;
  getEvaluationAverage(recipeId: string): Promise<number>;
  updateEvaluationAverage(recipeId: string, average: number): Promise<void>;
}
