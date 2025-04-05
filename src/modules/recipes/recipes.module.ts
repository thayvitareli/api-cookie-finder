import { Module } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { RecipesController } from './recipes.controller';
import { DatabaseModule } from 'prisma/database.module';

@Module({
  controllers: [RecipesController],
  imports: [DatabaseModule],
  providers: [RecipesService],
})
export class RecipesModule {}
