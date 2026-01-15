import { RecipeRepository } from 'prisma/repositories/recipe/recipe.repository';
import { Inject, Injectable } from '@nestjs/common';
import { IRecipeRepository } from 'src/modules/recipes/domain/repository/recipe.repository.interface';

@Injectable()
export class DeleteRecipeUseCase {
  constructor(
    @Inject('IRecipeRepository')
    private readonly recipeRepository: IRecipeRepository,
  ) {}

  async execute(id: string) {
    return await this.recipeRepository.delete(id);
  }
}
