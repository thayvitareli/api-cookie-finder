import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UserRepository } from './repositories/user/user.repository';
import { RecipeRepository } from './repositories/recipe/recipe.repository';
import { CategoryRepository } from './repositories/category/category.repository';
import { NotificationRepository } from './repositories/notification/notification.repository';

@Module({
  providers: [
    PrismaService,
    UserRepository,
    RecipeRepository,
    CategoryRepository,
    NotificationRepository,
  ],
  exports: [
    PrismaService,
    UserRepository,
    RecipeRepository,
    CategoryRepository,
    NotificationRepository,
  ],
})
export class DatabaseModule {}
