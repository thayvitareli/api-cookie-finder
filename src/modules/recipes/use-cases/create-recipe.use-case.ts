import { Inject, Injectable } from '@nestjs/common';
import { IRecipeRepository } from 'src/modules/recipes/domain/repository/recipe.repository.interface';
import { CreateRecipeDto } from '../presentation/dto/create-recipe.dto';
import { Recipe } from '../domain/model/recipe.model';

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
