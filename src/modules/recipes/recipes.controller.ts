import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  Query,
} from '@nestjs/common';

import { CreateRecipeDto } from './dto/create-recipe.dto';
import { FindManySharedDto } from 'src/shared/dto/find-many.dto';
import { CreateRecipeUseCase } from './use-cases/create-recipe.use-case';
import { FindManyRecipeUseCase } from './use-cases/find-many-recipe.use-case';
import { DeleteRecipeUseCase } from './use-cases/delete-recipe.use-case';

@Controller('recipes')
export class RecipesController {
  constructor(
    private readonly createRecipeUseCase: CreateRecipeUseCase,
    private readonly findManyRecipeUseCase: FindManyRecipeUseCase,
    private readonly deleteRecipeUseCase: DeleteRecipeUseCase,
  ) {}

  @Post()
  create(@Body() body: CreateRecipeDto, @Request() req) {
    return this.createRecipeUseCase.execute({
      ...body,
      userId: req.user.userId,
    });
  }

  @Get()
  findAll(@Query() query: FindManySharedDto) {
    return this.findManyRecipeUseCase.execute(query);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deleteRecipeUseCase.execute(id);
  }
}
