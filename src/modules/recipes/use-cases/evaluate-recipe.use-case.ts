import { Inject, Injectable } from '@nestjs/common';
import { IRecipeRepository } from 'src/modules/recipes/domain/repository/recipe.repository.interface';
import { EvaluateRecipeDto } from '../presentation/dto/evaluate-recipe.dto';

@Injectable()
export class EvaluateRecipeUseCase {
  constructor(
    @Inject('IRecipeRepository')
    private readonly recipeRepository: IRecipeRepository,
  ) {}

  async execute(recipeId: string, userId: string, input: EvaluateRecipeDto) {
    await this.recipeRepository.createEvaluation(
      recipeId,
      userId,
      input.stars,
      input.comment,
    );

    const average = await this.recipeRepository.getEvaluationAverage(recipeId);

    await this.recipeRepository.updateEvaluationAverage(recipeId, average);

    return { evaluation_average: average };
  }
}
