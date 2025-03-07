import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { RecipesModule } from './modules/recipes/recipes.module';
import { DatabaseModule } from 'prisma/database.module';

@Module({
  imports: [DatabaseModule,UsersModule, RecipesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
