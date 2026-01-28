import { Module } from '@nestjs/common';
import { RecipesController } from './presentation/controller/recipes.controller';
import { DatabaseModule } from 'prisma/database.module';
import { CreateRecipeUseCase } from './use-cases/create-recipe.use-case';
import { DeleteRecipeUseCase } from './use-cases/delete-recipe.use-case';
import { RecipeRepository } from 'prisma/repositories/recipe/recipe.repository';
import { ListRecipesPaginatedUseCase } from './use-cases/list-recipes-paginated.use-case';
import { StorageModule } from '../storage/storage.module';

@Module({
  controllers: [RecipesController],
  imports: [DatabaseModule, StorageModule],
  providers: [
    CreateRecipeUseCase,
    ListRecipesPaginatedUseCase,
    DeleteRecipeUseCase,
    {
      provide: 'IRecipeRepository',
      useExisting: RecipeRepository,
    },
  ],
})
export class RecipesModule {}
