import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { IPostRepository } from '../../../modules/posts/domain/repository/post.repository.interface';
import { PostTag } from '../../../modules/posts/domain/model/post-tag.model';
import { Post } from '../../../modules/posts/domain/model/post.model';

@Injectable()
export class PostRepository implements IPostRepository {
  constructor(private prisma: PrismaService) {}

  async create(post: Post): Promise<Post> {
    const { title, content, image_uri, user_id, tags } = post;

    const data = await this.prisma.post.create({
      data: {
        title,
        content,
        image_uri,
        user: { connect: { id: user_id } },
        tags: tags
          ? {
              connect: tags.map((id) => ({ id })),
            }
          : undefined,
      },
      include: { tags: true },
    });

    return new Post({
      id: data.id,
      title: data.title,
      content: data.content,
      image_uri: data.image_uri ?? undefined,
      user_id: data.user_id,
      tags: data.tags.map((t) => t.name),
      created_at: data.created_at,
      updated_at: data.updated_at,
    });
  }

  async findById(id: string): Promise<Post | null> {
    const data = await this.prisma.post.findUnique({
      where: { id },
      include: { tags: true },
    });

    if (!data) return null;

    return new Post({
      id: data.id,
      title: data.title,
      content: data.content,
      image_uri: data.image_uri ?? undefined,
      user_id: data.user_id,
      tags: data.tags.map((t) => t.name),
      created_at: data.created_at,
      updated_at: data.updated_at,
    });
  }

  async findAll(filters: {
    skip?: number;
    take?: number;
    tag_ids?: string[];
  }): Promise<{ total: number; records: Post[] }> {
    const { skip, take, tag_ids } = filters;

    const where = {
      tags: tag_ids
        ? {
            some: {
              id: {
                in: tag_ids,
              },
            },
          }
        : undefined,
    };

    const [total, data] = await Promise.all([
      this.prisma.post.count({ where }),
      this.prisma.post.findMany({
        where,
        skip,
        take,
        include: { tags: true },
        orderBy: { created_at: 'desc' },
      }),
    ]);

    return {
      total,
      records: data.map(
        (item) =>
          new Post({
            id: item.id,
            title: item.title,
            content: item.content,
            image_uri: item.image_uri ?? undefined,
            user_id: item.user_id,
            tags: item.tags.map((t) => t.name),
            created_at: item.created_at,
            updated_at: item.updated_at,
          }),
      ),
    };
  }

  async findAllTags(): Promise<{ total: number; records: PostTag[] }> {
    const [total, data] = await Promise.all([
      this.prisma.post_tag.count(),
      this.prisma.post_tag.findMany({
        orderBy: { name: 'asc' },
      }),
    ]);

    return {
      total,
      records: data.map(
        (item) =>
          new PostTag({
            id: item.id,
            name: item.name,
          }),
      ),
    };
  }
}
