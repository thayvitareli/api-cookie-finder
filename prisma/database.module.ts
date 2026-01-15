import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UserRepository } from './repositories/user/user.repository';
import { RecipeRepository } from './repositories/recipe/recipe.repository';


@Module({
  providers: [PrismaService, UserRepository,RecipeRepository],
  exports: [UserRepository,RecipeRepository]
})
export class DatabaseModule {}
