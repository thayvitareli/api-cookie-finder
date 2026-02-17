import { Category } from '../domain/model/category.model';
import { ListCategoriesUseCase } from './list-categories.use-case';
import { ICategoryRepository } from '../domain/repository/category.repository.interface';

describe('ListCategoriesUseCase', () => {
  const categories = [
    new Category({
      id: '1',
      name: 'Doces',
      image_uri: 'image-1',
      code: 'doces',
    }),
    new Category({
      id: '2',
      name: 'Salgados',
      image_uri: 'image-2',
      code: 'salgados',
    }),
  ];

  const findMany = jest.fn().mockResolvedValue(categories);
  const total = jest.fn().mockResolvedValue(categories.length);

  const repository: ICategoryRepository = {
    create: jest.fn() as any,
    findMany: findMany as any,
    total: total as any,
    incrementViews: jest.fn() as any,
  };

  const useCase = new ListCategoriesUseCase(repository);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return paginated categories with total', async () => {
    const response = await useCase.execute({
      skip: 5,
      take: 10,
      userId: 'user-1',
      categoryId: 'category-1',
      nameContains: 'doce',
    });

    expect(findMany).toHaveBeenCalledWith(
      { userId: 'user-1', categoryId: 'category-1', nameContains: 'doce' },
      5,
      10,
    );
    expect(total).toHaveBeenCalledWith({
      userId: 'user-1',
      categoryId: 'category-1',
      nameContains: 'doce',
    });
    expect(response).toEqual({
      total: categories.length,
      records: categories,
    });
  });
});
