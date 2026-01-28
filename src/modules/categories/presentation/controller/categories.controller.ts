import { Controller, Get, Query } from '@nestjs/common';
import { Public } from 'src/shared/decorator/public.decorator';
import { ListCategoriesPaginatedRequest } from '../dto/list-categories';
import { ListCategoriesUseCase } from '../../use-cases/list-categories.use-case';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly listCategoriesUseCase: ListCategoriesUseCase) {}

  @Public()
  @Get()
  findAll(@Query() query: ListCategoriesPaginatedRequest) {
    return this.listCategoriesUseCase.execute(query);
  }
}
