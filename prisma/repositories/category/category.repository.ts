import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

import {
  CategoryQuery,
  ICategoryRepository,
} from 'src/modules/categories/domain/repository/category.repository.interface';
import { Category } from 'src/modules/categories/domain/model/category.model';

@Injectable()
export class CategoryRepository implements ICategoryRepository {
  constructor(private prisma: PrismaService) {}

  async create(category: Category): Promise<void> {
    await this.prisma.category.create({
      data: {
        name: category.name,
        image_uri: category.image_uri,
        code: category.code,
      },
    });
  }
  async findMany(
    query: CategoryQuery,
    skip?: number,
    take?: number,
  ): Promise<Category[]> {
    const where: Prisma.categoryWhereInput = this.toPrismaWhere(query);

    const data = await this.prisma.category.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });

    return data.map((c) => new Category(c));
  }

  async total(query: CategoryQuery): Promise<number> {
    const where: Prisma.categoryWhereInput = this.toPrismaWhere(query);

    return this.prisma.category.count({ where });
  }

  private toPrismaWhere(query: CategoryQuery): Prisma.categoryWhereInput {
    const where: Prisma.categoryWhereInput = {};

    if (query.categoryId) {
      where.id = query.categoryId;
    }

    if (query.nameContains) {
      where.name = { contains: query.nameContains, mode: 'insensitive' };
    }

    return where;
  }
}
