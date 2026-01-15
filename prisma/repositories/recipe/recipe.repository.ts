import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { Recipe } from 'src/modules/recipes/entities/recipe.entity';
import {
  IRecipeRepository,
  RecipeQuery,
} from '../../../src/modules/recipes/domain/repository/recipe.repository.interface';

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
      user_id,
    } = recipe;

    await this.prisma.recipe.create({
      data: {
        category: { connect: { id: category_id } },
        ingredients: JSON.parse(ingredients),
        instructions,
        name,
        image_uri,
        video_uri,
        user: { connect: { id: user_id } },
      },
    });
  }

  async findMany(query: RecipeQuery, skip = 0, take = 10): Promise<Recipe[]> {
    const where: Prisma.recipeWhereInput = this.toPrismaWhere(query);

    const recipes = await this.prisma.recipe.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });

    return recipes.map((r) => new Recipe(r));
  }

  async total(query: RecipeQuery): Promise<number> {
    const where: Prisma.recipeWhereInput = this.toPrismaWhere(query);
    return this.prisma.recipe.count({ where });
  }

  async findById(id: string): Promise<Recipe | null> {
    const data = await this.prisma.recipe.findUnique({ where: { id } });
    return data ? new Recipe(data) : null;
  }

  async findAllByUser(userId: string): Promise<Recipe[]> {
    const recipes = await this.prisma.recipe.findMany({
      where: { user_id: userId },
      orderBy: { createdAt: 'desc' },
    });
    return recipes.map((r) => new Recipe(r));
  }

  async update(recipe: Recipe): Promise<void> {
    await this.prisma.recipe.update({
      where: { id: recipe.id },
      data: {
        name: recipe.name,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        image_uri: recipe.image_uri,
        video_uri: recipe.video_uri,
        category_id: recipe.category_id,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.recipe.delete({ where: { id } });
  }

  private toPrismaWhere(query: RecipeQuery): Prisma.recipeWhereInput {
    const where: Prisma.recipeWhereInput = {};

    if (query.userId) where.user_id = query.userId;
    if (query.categoryId) where.category_id = query.categoryId;
    if (query.nameContains)
      where.name = { contains: query.nameContains, mode: 'insensitive' };

    return where;
  }
}
