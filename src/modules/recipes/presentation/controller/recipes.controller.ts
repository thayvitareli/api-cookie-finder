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

import { CreateRecipeUseCase } from '../../use-cases/create-recipe.use-case';
import { DeleteRecipeUseCase } from '../../use-cases/delete-recipe.use-case';
import { Public } from 'src/shared/decorator/public.decorator';
import { ListRecipesPaginatedUseCase } from '../../use-cases/list-recipes-paginated.use-case';
import { ListRecipesPaginatedRequest } from '../dto/list-recipes.dto';
import { CreateRecipeDto } from '../dto/create-recipe.dto';

@Controller('recipes')
export class RecipesController {
  constructor(
    private readonly createRecipeUseCase: CreateRecipeUseCase,
    private readonly listRecipesPaginatedUseCase: ListRecipesPaginatedUseCase,
    private readonly deleteRecipeUseCase: DeleteRecipeUseCase,
  ) {}

  @Post()
  create(@Body() body: CreateRecipeDto, @Request() req) {
    return this.createRecipeUseCase.execute({
      ...body,
      user_id: req.user.userId,
    });
  }

  @Public()
  @Get()
  findAll(@Query() query: ListRecipesPaginatedRequest) {
    console.log('find all recipes');
    return this.listRecipesPaginatedUseCase.execute(query);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deleteRecipeUseCase.execute(id);
  }
}
