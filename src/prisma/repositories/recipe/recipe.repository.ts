import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma.service';
import {
  IRecipeRepository,
  RecipeQuery,
} from 'src/modules/recipes/domain/repository/recipe.repository.interface';
import {
  Ingredient,
  InstructionStep,
  Recipe,
} from 'src/modules/recipes/domain/model/recipe.model';
import { RecipeEvaluation } from 'src/modules/recipes/domain/model/recipe-evaluation.model';

@Injectable()
export class RecipeRepository implements IRecipeRepository {
  constructor(private prisma: PrismaService) {}

  async create(recipe: Recipe) {
    const {
      category_id,
      ingredients,
      instructions,
      name,
      image_uri,
      video_uri,
      servings,
      prep_time_min,
      user_id,
    } = recipe;

    await this.prisma.recipe.create({
      data: {
        category: { connect: { id: category_id } },
        ingredients: ingredients as Prisma.JsonValue,
        instructions: instructions as Prisma.JsonValue,
        name,
        image_uri,
        video_uri,
        servings,
        prep_time_min,
        user: { connect: { id: user_id } },
      },
    });
  }

  async findMany(query: RecipeQuery, skip = 0, take = 10): Promise<Recipe[]> {
    const where: Prisma.recipeWhereInput = this.toPrismaWhere(query);

    const orderBy: Prisma.recipeOrderByWithRelationInput = {};

    if (query.orderBy === 'top_rated') {
      orderBy.evaluation_average = 'desc';
    } else {
      orderBy.createdAt = 'desc';
    }

    const recipes = await this.prisma.recipe.findMany({
      where,
      skip,
      take,
      orderBy,
      include: query.currentUserId
        ? {
            favorite_recipes: {
              where: { user_id: query.currentUserId },
            },
          }
        : undefined,
    });

    return recipes.map((r) =>
      this.toDomain({
        ...r,
        is_favorited: query.currentUserId
          ? r.favorite_recipes.length > 0
          : undefined,
      }),
    );
  }

  async total(query: RecipeQuery): Promise<number> {
    const where: Prisma.recipeWhereInput = this.toPrismaWhere(query);
    return this.prisma.recipe.count({ where });
  }

  async findById(id: string): Promise<Recipe | null> {
    const data = await this.prisma.recipe.findUnique({ where: { id } });
    return data ? this.toDomain(data) : null;
  }

  async findAllByUser(userId: string): Promise<Recipe[]> {
    const recipes = await this.prisma.recipe.findMany({
      where: { user_id: userId },
      orderBy: { createdAt: 'desc' },
    });
    return recipes.map((r) => this.toDomain(r));
  }

  async update(recipe: Recipe): Promise<void> {
    await this.prisma.recipe.update({
      where: { id: recipe.id },
      data: {
        name: recipe.name,
        ingredients: recipe.ingredients as Prisma.JsonValue,
        instructions: recipe.instructions as Prisma.JsonValue,
        image_uri: recipe.image_uri,
        video_uri: recipe.video_uri,
        servings: recipe.servings,
        prep_time_min: recipe.prep_time_min,
        category_id: recipe.category_id,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.recipe.delete({ where: { id } });
  }

  async favorite(recipeId: string, userId: string): Promise<void> {
    await this.prisma.favorite_recipe.upsert({
      where: {
        recipe_id_user_id: {
          recipe_id: recipeId,
          user_id: userId,
        },
      },
      update: {},
      create: {
        recipe: { connect: { id: recipeId } },
        user: { connect: { id: userId } },
      },
    });
  }

  async unfavorite(recipeId: string, userId: string): Promise<void> {
    await this.prisma.favorite_recipe.deleteMany({
      where: {
        recipe_id: recipeId,
        user_id: userId,
      },
    });
  }

  async createEvaluation(
    recipeId: string,
    userId: string,
    stars: number,
    comment: string,
  ): Promise<void> {
    await this.prisma.recipe_evaluation.create({
      data: {
        stars,
        comment,
        recipe: { connect: { id: recipeId } },
        user: { connect: { id: userId } },
      },
    });
  }

  async findEvaluations(
    recipeId: string,
    skip = 0,
    take = 10,
  ): Promise<RecipeEvaluation[]> {
    const evaluations = await this.prisma.recipe_evaluation.findMany({
      where: { recipe_id: recipeId },
      skip,
      take,
      orderBy: { created_at: 'desc' },
      include: {
        user: {
          select: {
            name: true,
            avatar: true,
          },
        },
      },
    });

    return evaluations.map(
      (evaluation) =>
        new RecipeEvaluation({
          id: evaluation.id,
          stars: evaluation.stars,
          comment: evaluation.comment,
          user_id: evaluation.user_id,
          recipe_id: evaluation.recipe_id,
          user_name: evaluation.user?.name ?? undefined,
          user_avatar: evaluation.user?.avatar ?? undefined,
          created_at: evaluation.created_at,
        }),
    );
  }

  async totalEvaluations(recipeId: string): Promise<number> {
    return this.prisma.recipe_evaluation.count({
      where: { recipe_id: recipeId },
    });
  }

  async getEvaluationAverage(recipeId: string): Promise<number> {
    const aggregate = await this.prisma.recipe_evaluation.aggregate({
      where: { recipe_id: recipeId },
      _avg: { stars: true },
    });

    return aggregate._avg.stars ?? 0;
  }

  async updateEvaluationAverage(
    recipeId: string,
    average: number,
  ): Promise<void> {
    await this.prisma.recipe.update({
      where: { id: recipeId },
      data: { evaluation_average: average },
    });
  }
  
  async isFavorited(recipeId: string, userId: string): Promise<boolean> {
    const favorite = await this.prisma.favorite_recipe.findUnique({
      where: {
        recipe_id_user_id: {
          recipe_id: recipeId,
          user_id: userId,
        },
      },
    });

    return !!favorite;
  }

  private toPrismaWhere(query: RecipeQuery): Prisma.recipeWhereInput {
    const where: Prisma.recipeWhereInput = {};

    if (query.userId) where.user_id = query.userId;
    if (query.categoryId) where.category_id = query.categoryId;
    if (query.nameContains)
      where.name = { contains: query.nameContains, mode: 'insensitive' };
    if (query.favoritedByUserId) {
      where.favorite_recipes = {
        some: { user_id: query.favoritedByUserId },
      };
    }

    if (query.categoryCode) {
      where.category = {
        code: query.categoryCode,
      };
    }

    if (query.minCreatedAt) {
      where.createdAt = {
        gte: query.minCreatedAt,
      };
    }

    return where;
  }

  private toDomain(r: any): Recipe {
    return new Recipe({
      id: r.id,
      name: r.name,
      ingredients: (r.ingredients ?? []) as unknown as Ingredient[],
      instructions: (r.instructions ?? []) as unknown as InstructionStep[],
      image_uri: r.image_uri ?? undefined,
      video_uri: r.video_uri ?? undefined,
      servings: r.servings ?? undefined,
      prep_time_min: r.prep_time_min ?? undefined,
      user_id: r.user_id,
      category_id: r.category_id,
      created_at: r.createdAt,
      is_favorited: r.is_favorited,
    });
  }
}
