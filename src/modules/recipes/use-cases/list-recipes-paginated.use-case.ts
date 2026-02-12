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

    const repoQuery: any = { ...query };

    if (query.period === 'weekly') {
      const now = new Date();
      now.setDate(now.getDate() - 7);
      repoQuery.minCreatedAt = now;
    }

    const { orderBy, ...rest } = repoQuery;

    const [recipes, total] = await Promise.all([
      this.recipeRepository.findMany({ ...rest, minCreatedAt: repoQuery.minCreatedAt, orderBy: query.orderBy }, skip, take),
      this.recipeRepository.total({ ...rest, minCreatedAt: repoQuery.minCreatedAt }),
    ]);

    return {
      total,
      records: recipes,
    };
  }
}
