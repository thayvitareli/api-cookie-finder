import {
  IRecipeRepository,
  RecipeRepository,
} from 'prisma/repositories/recipe.repository';
import { CreateRecipeDto } from '../dto/create-recipe.dto';
import { Inject, Injectable } from '@nestjs/common';
import { FindManySharedDto } from 'src/shared/dto/find-many.dto';
@Injectable()
export class FindManyRecipeUseCase {
  constructor(
    @Inject('IRecipeRepository')
    private readonly recipeRepository: IRecipeRepository,
  ) {}

  async execute(input: FindManySharedDto) {
    let where = {};

    const { search, skip, take, userId } = input;
    if (search) {
      where = { ...where, name: { contains: search } };
    }

    const [total, records] = await Promise.all([
      this.recipeRepository.total(where),
      this.recipeRepository.findMany({ where, skip, take }),
    ]);

    return { total, records };
  }
}
