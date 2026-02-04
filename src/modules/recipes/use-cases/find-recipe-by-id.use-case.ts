import { Inject, Injectable } from '@nestjs/common';
import { IRecipeRepository } from 'src/modules/recipes/domain/repository/recipe.repository.interface';

@Injectable()
export class FindRecipeByIdUseCase {
  constructor(
    @Inject('IRecipeRepository')
    private readonly recipeRepository: IRecipeRepository,
  ) {}

  async execute(id: string) {
    return this.recipeRepository.findById(id);
  }
}
