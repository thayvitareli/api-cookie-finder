import { Injectable } from '@nestjs/common';
import { recipe, Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class RecipeRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.recipeCreateInput): Promise<recipe> {
    return this.prisma.recipe.create({
      data,
    });
  }

  async findOne(where: Prisma.recipeWhereInput): Promise<recipe> {
    return this.prisma.recipe.findFirst({
      where,
    });
  }

  async update(
    where: Prisma.recipeWhereUniqueInput,
    data: Prisma.recipeUpdateInput,
  ): Promise<recipe> {
    return this.prisma.recipe.update({
      where,
      data,
    });
  }
}
