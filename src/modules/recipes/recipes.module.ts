import { Module } from '@nestjs/common';
import { RecipesController } from './recipes.controller';
import { DatabaseModule } from 'prisma/database.module';
import { CreateRecipeUseCase } from './use-cases/create-recipe.use-case';
import { FindManyRecipeUseCase } from './use-cases/find-many-recipe.use-case';
import { DeleteRecipeUseCase } from './use-cases/delete-recipe.use-case';
import { RecipeRepository } from 'prisma/repositories/recipe.repository';

@Module({
  controllers: [RecipesController],
  imports: [DatabaseModule],
  providers: [
    CreateRecipeUseCase,
FindManyRecipeUseCase,
DeleteRecipeUseCase,
{
  provide: 'IRecipeRepository',
  useExisting: RecipeRepository
}],
})
export class RecipesModule {}
