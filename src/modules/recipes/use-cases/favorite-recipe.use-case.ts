import { Inject, Injectable } from '@nestjs/common';
import { IRecipeRepository } from '../domain/repository/recipe.repository.interface';

@Injectable()
export class FavoriteRecipeUseCase {
  constructor(
    @Inject('IRecipeRepository')
    private readonly recipeRepository: IRecipeRepository,
  ) {}

  async execute(recipeId: string, userId: string) {
    return this.recipeRepository.favorite(recipeId, userId);
  }
}
