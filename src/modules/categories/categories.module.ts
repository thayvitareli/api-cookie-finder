import { Module } from '@nestjs/common';
import { DatabaseModule } from 'prisma/database.module';

import { StorageModule } from '../storage/storage.module';
import { CategoriesController } from './presentation/controller/categories.controller';
import { ListCategoriesUseCase } from './use-cases/list-categories.use-case';
import { CategoryRepository } from 'prisma/repositories/category/category.repository';

@Module({
  imports: [DatabaseModule, StorageModule],
  controllers: [CategoriesController],
  providers: [
    ListCategoriesUseCase,
    {
      provide: 'ICategoryRepository',
      useExisting: CategoryRepository,
    },
  ],
})
export class CategoriesModule {}
