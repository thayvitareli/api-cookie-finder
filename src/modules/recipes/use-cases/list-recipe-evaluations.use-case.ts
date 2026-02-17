import { Inject } from '@nestjs/common';
import { IRecipeRepository } from '../domain/repository/recipe.repository.interface';
import { ListRecipeEvaluationsRequest } from '../presentation/dto/list-recipe-evaluations.dto';

export class ListRecipeEvaluationsUseCase {
  constructor(
    @Inject('IRecipeRepository')
    private readonly recipeRepository: IRecipeRepository,
  ) {}

  async execute(recipeId: string, { skip, take }: ListRecipeEvaluationsRequest) {
    const [evaluations, total] = await Promise.all([
      this.recipeRepository.findEvaluations(recipeId, skip, take),
      this.recipeRepository.totalEvaluations(recipeId),
    ]);

    return {
      total,
      records: evaluations,
    };
  }
}
