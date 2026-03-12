import { Inject, Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { IRecipeRepository } from '../domain/repository/recipe.repository.interface';
import { CreateRecipeDto } from '../presentation/dto/create-recipe.dto';
import { Recipe } from '../domain/model/recipe.model';
import { IStorageProvider } from '../../storage/domain/provider/storage.provider.interface';

@Injectable()
export class CreateRecipeUseCase {
  constructor(
    @Inject('IRecipeRepository')
    private readonly recipeRepository: IRecipeRepository,
    @Inject('IStorageProvider')
    private readonly storageProvider: IStorageProvider,
    @InjectQueue('recipe-notifications')
    private readonly notificationQueue: Queue,
  ) {}

  async execute(input: CreateRecipeDto) {
    let imageUri = '';

    if (input.file) {
      const uri = await this.storageProvider.uploadImage({
        buffer: input.file.buffer,
        filename: input.file.originalname,
        contentType: input.file.mimetype,
        folder: 'recipes',
        makePublic: true,
      });

      imageUri = uri.url;
    }

    const recipe = new Recipe({
      name: input.name,
      ingredients: input.ingredients,
      instructions: input.instructions,
      servings: input.servings,
      prep_time_min: input.prep_time_min,
      user_id: input.user_id,
      category_id: input.category_id,
      image_uri: imageUri,
    });

    await this.recipeRepository.create(recipe);

    await this.notificationQueue.add('new-recipe', {
      recipeId: recipe.id,
      recipeName: recipe.name,
      authorId: recipe.user_id,
    });

    return recipe;
  }
}

