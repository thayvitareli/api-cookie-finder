import { IRecipeRepository, RecipeRepository } from "prisma/repositories/recipe.repository";
import { CreateRecipeDto } from "../dto/create-recipe.dto";
import {Inject, Injectable} from '@nestjs/common'
@Injectable()
export class CreateRecipeUseCase{


    constructor(
        @Inject('IRecipeRepository')
        private readonly recipeRepository:IRecipeRepository){}

    async execute(input:CreateRecipeDto){
        const {category_id,
            ingredients, instructions, name ,userId,image_uri,video_uri
        } = input;

        return await this.recipeRepository.create({
           category: {connect:{id: category_id}},
ingredients: JSON.parse(ingredients),
instructions,
name,
image_uri,
video_uri,
user: {connect: {id:userId }}
        })
    }
}