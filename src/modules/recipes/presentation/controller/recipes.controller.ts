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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

import { CreateRecipeUseCase } from '../../use-cases/create-recipe.use-case';
import { DeleteRecipeUseCase } from '../../use-cases/delete-recipe.use-case';
import { Public } from 'src/shared/decorator/public.decorator';
import { ListRecipesPaginatedUseCase } from '../../use-cases/list-recipes-paginated.use-case';
import { ListRecipesPaginatedRequest } from '../dto/list-recipes.dto';
import { CreateRecipeDto } from '../dto/create-recipe.dto';
import { ListFavoriteRecipesUseCase } from '../../use-cases/list-favorite-recipes.use-case';

@Controller('recipes')
export class RecipesController {
  constructor(
    private readonly createRecipeUseCase: CreateRecipeUseCase,
    private readonly listRecipesPaginatedUseCase: ListRecipesPaginatedUseCase,
    private readonly listFavoriteRecipesUseCase: ListFavoriteRecipesUseCase,
    private readonly deleteRecipeUseCase: DeleteRecipeUseCase,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Body() body: CreateRecipeDto,
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ) {
    return this.createRecipeUseCase.execute({
      ...body,
      user_id: req.user.userId,
      file,
    });
  }

  @Public()
  @Get()
  findAll(@Query() query: ListRecipesPaginatedRequest) {
    console.log('find all recipes');
    return this.listRecipesPaginatedUseCase.execute(query);
  }

  @Get('me')
  findMine(@Query() query: ListRecipesPaginatedRequest, @Request() req) {
    return this.listRecipesPaginatedUseCase.execute({
      ...query,
      userId: req.user.userId,
    });
  }

  @Get('me/favorites')
  findMyFavorites(@Query() query: ListRecipesPaginatedRequest, @Request() req) {
    return this.listFavoriteRecipesUseCase.execute(req.user.userId, query);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deleteRecipeUseCase.execute(id);
  }
}
