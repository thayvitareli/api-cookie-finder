import type { Express } from 'express';
import { Category } from '../domain/model/category.model';
import { CreateCategoryUseCase } from './create-category.use-case';
import { ICategoryRepository } from '../domain/repository/category.repository.interface';
import { IStorageProvider } from 'src/modules/storage/domain/provider/storage.provider.interface';

describe('CreateCategoryUseCase', () => {
  const create = jest.fn();
  const uploadImage = jest.fn();

  const repository: ICategoryRepository = {
    create: create as any,
    findMany: jest.fn() as any,
    total: jest.fn() as any,
  };

  const storage: IStorageProvider = {
    uploadImage: uploadImage as any,
    getImageUrl: jest.fn() as any,
    downloadImage: jest.fn() as any,
  };

  const useCase = new CreateCategoryUseCase(repository, storage);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should upload image when file is provided and persist category', async () => {
    uploadImage.mockResolvedValue({ path: 'categories/img-1', url: 'url' });

    const file = {
      buffer: Buffer.from('fake'),
      originalname: 'photo.png',
      mimetype: 'image/png',
    } as Express.Multer.File;

    const result = await useCase.execute({ name: 'Doces', file });

    expect(uploadImage).toHaveBeenCalledWith({
      buffer: file.buffer,
      filename: file.originalname,
      contentType: file.mimetype,
      folder: 'categories',
      makePublic: true,
    });

    expect(create).toHaveBeenCalledTimes(1);
    const savedCategory = (create.mock.calls[0] as [Category])[0];
    expect(savedCategory.name).toBe('Doces');
    expect(savedCategory.image_uri).toBe('categories/img-1');

    expect(result).toBeInstanceOf(Category);
  });
});
