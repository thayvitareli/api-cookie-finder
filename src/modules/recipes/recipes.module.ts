import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { RecipesController } from './presentation/controller/recipes.controller';
import { DatabaseModule } from '../../prisma/database.module';
import { CreateRecipeUseCase } from './use-cases/create-recipe.use-case';
import { DeleteRecipeUseCase } from './use-cases/delete-recipe.use-case';
import { RecipeRepository } from '../../prisma/repositories/recipe/recipe.repository';
import { ListRecipesPaginatedUseCase } from './use-cases/list-recipes-paginated.use-case';
import { StorageModule } from '../storage/storage.module';
import { CategoriesModule } from '../categories/categories.module';
import { ListFavoriteRecipesUseCase } from './use-cases/list-favorite-recipes.use-case';
import { FavoriteRecipeUseCase } from './use-cases/favorite-recipe.use-case';
import { UnfavoriteRecipeUseCase } from './use-cases/unfavorite-recipe.use-case';
import { FindRecipeByIdUseCase } from './use-cases/find-recipe-by-id.use-case';
import { EvaluateRecipeUseCase } from './use-cases/evaluate-recipe.use-case';
import { ListRecipeEvaluationsUseCase } from './use-cases/list-recipe-evaluations.use-case';
import { RecipeNotificationProcessor } from './jobs/recipe-notification.processor';
import { NotificationsModule } from '../notifications/notifications.module';
import { UserRepository } from 'prisma/repositories/user/user.repository';
import { NotificationRepository } from 'prisma/repositories/notification/notification.repository';
import { OneSignalNotificationRepository } from '../notifications/infrastructure/onesignal/onesignal-notification.repository';

@Module({
  controllers: [RecipesController],
  imports: [
    DatabaseModule,
    StorageModule,
    CategoriesModule,
    NotificationsModule,
    BullModule.registerQueue({ name: 'recipe-notifications' }),
  ],
  providers: [
    CreateRecipeUseCase,
    ListRecipesPaginatedUseCase,
    ListFavoriteRecipesUseCase,
    FavoriteRecipeUseCase,
    UnfavoriteRecipeUseCase,
    EvaluateRecipeUseCase,
    ListRecipeEvaluationsUseCase,
    DeleteRecipeUseCase,
    FindRecipeByIdUseCase,
    RecipeNotificationProcessor,
    {
      provide: 'IRecipeRepository',
      useExisting: RecipeRepository,
    },
    {
      provide: 'IUserRepository',
      useExisting: UserRepository,
    },
    {
      provide: 'INotificationRepository',
      useExisting: NotificationRepository,
    },
  ],
})
export class RecipesModule {}

