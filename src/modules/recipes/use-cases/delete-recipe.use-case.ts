import {
  IRecipeRepository,
  RecipeRepository,
} from 'prisma/repositories/recipe.repository';
import { Inject, Injectable } from '@nestjs/common';
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
