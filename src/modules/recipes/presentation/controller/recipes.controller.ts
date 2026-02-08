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
import { FavoriteRecipeUseCase } from '../../use-cases/favorite-recipe.use-case';
import { UnfavoriteRecipeUseCase } from '../../use-cases/unfavorite-recipe.use-case';
import { FindRecipeByIdUseCase } from '../../use-cases/find-recipe-by-id.use-case';
import { EvaluateRecipeUseCase } from '../../use-cases/evaluate-recipe.use-case';
import { EvaluateRecipeDto } from '../dto/evaluate-recipe.dto';
import { ListRecipeEvaluationsUseCase } from '../../use-cases/list-recipe-evaluations.use-case';
import { ListRecipeEvaluationsRequest } from '../dto/list-recipe-evaluations.dto';

@Controller('recipes')
export class RecipesController {
  constructor(
    private readonly createRecipeUseCase: CreateRecipeUseCase,
    private readonly listRecipesPaginatedUseCase: ListRecipesPaginatedUseCase,
    private readonly listFavoriteRecipesUseCase: ListFavoriteRecipesUseCase,
    private readonly favoriteRecipeUseCase: FavoriteRecipeUseCase,
    private readonly unfavoriteRecipeUseCase: UnfavoriteRecipeUseCase,
    private readonly evaluateRecipeUseCase: EvaluateRecipeUseCase,
    private readonly listRecipeEvaluationsUseCase: ListRecipeEvaluationsUseCase,
    private readonly deleteRecipeUseCase: DeleteRecipeUseCase,
    private readonly findRecipeByIdUseCase: FindRecipeByIdUseCase,
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

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.findRecipeByIdUseCase.execute(id);
  }

  @Post(':id/favorite')
  favorite(@Param('id') id: string, @Request() req) {
    return this.favoriteRecipeUseCase.execute(id, req.user.userId);
  }

  @Delete(':id/favorite')
  unfavorite(@Param('id') id: string, @Request() req) {
    return this.unfavoriteRecipeUseCase.execute(id, req.user.userId);
  }

  @Post(':id/evaluate')
  evaluate(
    @Param('id') id: string,
    @Body() body: EvaluateRecipeDto,
    @Request() req,
  ) {
    return this.evaluateRecipeUseCase.execute(id, req.user.userId, body);
  }

  @Public()
  @Get(':id/evaluations')
  listEvaluations(
    @Param('id') id: string,
    @Query() query: ListRecipeEvaluationsRequest,
  ) {
    return this.listRecipeEvaluationsUseCase.execute(id, query);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deleteRecipeUseCase.execute(id);
  }
}
