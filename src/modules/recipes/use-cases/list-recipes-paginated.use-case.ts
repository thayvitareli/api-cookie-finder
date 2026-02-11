import { IRecipeRepository } from 'src/modules/recipes/domain/repository/recipe.repository.interface';
import { Inject } from '@nestjs/common';
import { ListRecipesPaginatedRequest } from '../presentation/dto/list-recipes.dto';

import { ICategoryRepository } from 'src/modules/categories/domain/repository/category.repository.interface';

export class ListRecipesPaginatedUseCase {
  constructor(
    @Inject('IRecipeRepository')
    private readonly recipeRepository: IRecipeRepository,
    @Inject('ICategoryRepository')
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  async execute({ skip, take, ...query }: ListRecipesPaginatedRequest) {
    if (query.categoryId) {
      await this.categoryRepository.incrementViews(query.categoryId);
    }

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
