import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { RecipesModule } from './modules/recipes/recipes.module';
import { DatabaseModule } from 'prisma/database.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './modules/auth/guard/jwt-auth.guard';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [DatabaseModule,UsersModule, RecipesModule, AuthModule],
  controllers: [],
  providers: [ {
    provide: APP_GUARD,
    useClass: JwtAuthGuard,
  },],
})
export class AppModule {}
