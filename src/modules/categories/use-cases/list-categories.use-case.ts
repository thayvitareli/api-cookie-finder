import { Inject } from '@nestjs/common';
import { ListCategoriesPaginatedRequest } from '../presentation/dto/list-categories';
import {
  CategoryQuery,
  ICategoryRepository,
} from '../domain/repository/category.repository.interface';

export class ListCategoriesUseCase {
  constructor(
    @Inject('ICategoryRepository')
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  async execute({ skip, take, ...query }: ListCategoriesPaginatedRequest) {
    const { filters, pagination } = this.extractFiltersAndPagination(
      query,
      skip,
      take,
    );

    const [categories, total] = await Promise.all([
      this.categoryRepository.findMany(
        filters,
        pagination.skip,
        pagination.take,
      ),
      this.categoryRepository.total(filters),
    ]);

    return {
      total,
      records: categories,
    };
  }

  private extractFiltersAndPagination(
    query: Omit<ListCategoriesPaginatedRequest, 'skip' | 'take'>,
    skip?: number,
    take?: number,
  ): { filters: CategoryQuery; pagination: { skip?: number; take?: number } } {
    const filters: CategoryQuery = {};

    if (query.userId) filters.userId = query.userId;
    if (query.categoryId) filters.categoryId = query.categoryId;
    if (query.nameContains) filters.nameContains = query.nameContains;

    return {
      filters,
      pagination: { skip, take },
    };
  }
}
