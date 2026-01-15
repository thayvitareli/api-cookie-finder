import { RecipeRepository } from 'prisma/repositories/recipe/recipe.repository';
import { CreateRecipeDto } from '../dto/create-recipe.dto';
import { Inject, Injectable } from '@nestjs/common';
import { Recipe } from '../entities/recipe.entity';
import { IRecipeRepository } from 'src/modules/recipes/domain/repository/recipe.repository.interface';

@Injectable()
export class CreateRecipeUseCase {
  constructor(
    @Inject('IRecipeRepository')
    private readonly recipeRepository: IRecipeRepository,
  ) {}

  async execute(input: CreateRecipeDto) {
    const recipe = new Recipe({
      name: input.name,
      ingredients: input.ingredients,
      instructions: input.instructions,
      user_id: input.user_id,
      category_id: input.category_id,
      image_uri: input.image_uri,
      video_uri: input.video_uri,
    });

    return await this.recipeRepository.create(recipe);
  }
}
