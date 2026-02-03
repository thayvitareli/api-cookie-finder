import { Inject } from '@nestjs/common';
import { IRecipeRepository } from 'src/modules/recipes/domain/repository/recipe.repository.interface';
import { ListRecipesPaginatedRequest } from '../presentation/dto/list-recipes.dto';

export class ListFavoriteRecipesUseCase {
  constructor(
    @Inject('IRecipeRepository')
    private readonly recipeRepository: IRecipeRepository,
  ) {}

  async execute(
    userId: string,
    { skip, take, ...query }: ListRecipesPaginatedRequest,
  ) {
    const filters = { ...query, favoritedByUserId: userId };

    const [recipes, total] = await Promise.all([
      this.recipeRepository.findMany(filters, skip, take),
      this.recipeRepository.total(filters),
    ]);

    return {
      total,
      records: recipes,
    };
  }
}
