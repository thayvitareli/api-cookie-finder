import { Category } from '../model/category.model';

export interface CategoryQuery {
  userId?: string;
  categoryId?: string;
  nameContains?: string;
}

export interface ICategoryRepository {
  create(category: Category): Promise<void>;
  findMany(query: CategoryQuery, skip?: number, take?: number): Promise<Category[]>;
  total(query: CategoryQuery): Promise<number>;
}
