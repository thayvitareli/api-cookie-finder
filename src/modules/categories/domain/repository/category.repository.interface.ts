import { Category } from '../model/category.model';

export interface CategoryQuery {
  userId?: string;
  categoryId?: string;
  nameContains?: string;
}

export interface ICategoryRepository {
  findMany(query: CategoryQuery, skip?: number, take?: number): Promise<Category[]>;
  total(query: CategoryQuery): Promise<number>;
}
