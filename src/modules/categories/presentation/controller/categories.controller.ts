import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Public } from 'src/shared/decorator/public.decorator';
import { ListCategoriesPaginatedRequest } from '../dto/list-categories';
import { ListCategoriesUseCase } from '../../use-cases/list-categories.use-case';
import { CreateCategoryUseCase } from '../../use-cases/create-category.use-case';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { query } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly listCategoriesUseCase: ListCategoriesUseCase,
    private readonly createCategoryUseCase: CreateCategoryUseCase,
  ) {}

  @Public()
  @Get()
  findAll(@Query() query: ListCategoriesPaginatedRequest) {
    return this.listCategoriesUseCase.execute(query);
  }

  @Public()
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Body() body: CreateCategoryDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.createCategoryUseCase.execute({ ...body, file });
  }
}
