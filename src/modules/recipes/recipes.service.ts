import { Injectable } from '@nestjs/common';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { RecipeRepository } from 'prisma/repositories/recipe.repository';
import { FindManySharedDto } from 'src/shared/dto/find-many.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class RecipesService {
  constructor(private readonly recipeRepository:RecipeRepository){}
  async create({
    category_id,
    ingredients,
    instructions, 
    name, 
    image_uri, 
    video_uri,
    userId
  }: CreateRecipeDto) {
    const ingredientsParsed = JSON.parse(ingredients);

    return await this.recipeRepository.create({
category: {connect:{id: category_id}},
ingredients: ingredientsParsed,
instructions,
name,
image_uri,
video_uri,
user: {connect: {id:userId }}
    })
   
  }

  async findAll({skip, take, search}:FindManySharedDto) {
let where:Prisma.recipeWhereInput= {}

if(search) { where= {...where, name: {contains: search}}}

    const [total, records] = await Promise.all([
      this.recipeRepository.total(where),
      this.recipeRepository.findMany({where, skip, take})
    ])

    return {total, records}
  }

  findOne(id: number) {
    return `This action returns a #${id} recipe`;
  }

  update(id: number, updateRecipeDto: UpdateRecipeDto) {
    return `This action updates a #${id} recipe`;
  }

  remove(id: number) {
    return `This action removes a #${id} recipe`;
  }
}
