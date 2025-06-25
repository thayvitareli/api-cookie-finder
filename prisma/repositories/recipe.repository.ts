import { Injectable } from '@nestjs/common';
import { recipe, Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class RecipeRepository implements IRecipeRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.recipeCreateInput): Promise<recipe> {
    return this.prisma.recipe.create({
      data,
    });
  }

  async total(where: Prisma.recipeWhereInput) {
    return this.prisma.recipe.count({where});
  }

  async findMany({where,skip,take}:{where: Prisma.recipeWhereInput, skip:number, take:number}) {
    return this.prisma.recipe.findMany({where,skip,take});
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

   async delete(
    id:string): Promise<recipe> {
    return this.prisma.recipe.delete({
      where: {id},
    });
  }
}


export interface IRecipeRepository {

   create(data: Prisma.recipeCreateInput): Promise<recipe>

   total(where: Prisma.recipeWhereInput): Promise<number>

   findMany({where,skip,take}:{where: Prisma.recipeWhereInput, skip:number, take:number})

   findOne(where: Prisma.recipeWhereInput): Promise<recipe>

   update(
    where: Prisma.recipeWhereUniqueInput,
    data: Prisma.recipeUpdateInput,
  ): Promise<recipe>

    delete(
    id:string): Promise<recipe>
}