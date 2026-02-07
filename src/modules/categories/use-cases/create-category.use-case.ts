import { Inject, Injectable } from '@nestjs/common';
import { Category } from '../domain/model/category.model';
import { CreateCategoryDto } from '../presentation/dto/create-category.dto';
import { ICategoryRepository } from '../domain/repository/category.repository.interface';
import { IStorageProvider } from 'src/modules/storage/domain/provider/storage.provider.interface';

@Injectable()
export class CreateCategoryUseCase {
  constructor(
    @Inject('ICategoryRepository')
    private readonly categoryRepository: ICategoryRepository,
    @Inject('IStorageProvider')
    private readonly storageProvider: IStorageProvider,
  ) {}

  async execute(input: CreateCategoryDto) {
    let imageUri = input.image_uri;

    if (input.file) {
      const upload = await this.storageProvider.uploadImage({
        buffer: input.file.buffer,
        filename: input.file.originalname,
        contentType: input.file.mimetype,
        folder: 'categories',
        makePublic: true,
      });
      imageUri = upload.url;
    }

    const category = new Category({
      name: input.name,
      image_uri: imageUri ?? '',
      code: input.code,
    });

    await this.categoryRepository.create(category);
    return category;
  }
}
