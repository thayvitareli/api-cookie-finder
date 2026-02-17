import { Inject, Injectable } from '@nestjs/common';
import { IRecipeRepository } from '../domain/repository/recipe.repository.interface';

@Injectable()
export class UnfavoriteRecipeUseCase {
  constructor(
    @Inject('IRecipeRepository')
    private readonly recipeRepository: IRecipeRepository,
  ) {}

  async execute(recipeId: string, userId: string) {
    return this.recipeRepository.unfavorite(recipeId, userId);
  }
}
