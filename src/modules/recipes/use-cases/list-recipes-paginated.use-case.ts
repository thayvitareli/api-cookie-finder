import { IRecipeRepository } from 'src/modules/recipes/domain/repository/recipe.repository.interface';
import { ListRecipesPaginatedRequest } from '../dto/list-recipes.dto';
import { Inject } from '@nestjs/common';

export class ListRecipesPaginatedUseCase {
  constructor(
    @Inject('IRecipeRepository')
    private readonly recipeRepository: IRecipeRepository,
  ) {}

  async execute({ skip, take, ...query }: ListRecipesPaginatedRequest) {
    const [recipes, total] = await Promise.all([
      this.recipeRepository.findMany(query, skip, take),
      this.recipeRepository.total(query),
    ]);

    return {
      total,
      records: recipes,
    };
  }
}
