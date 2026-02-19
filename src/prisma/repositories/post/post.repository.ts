import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { IPostRepository } from '../../../modules/posts/domain/repository/post.repository.interface';
import { Post } from '../../../modules/posts/domain/model/post.model';

@Injectable()
export class PostRepository implements IPostRepository {
  constructor(private prisma: PrismaService) {}

  async create(post: Post): Promise<void> {
    const { title, content, image_uri, user_id, tags } = post;

    await this.prisma.post.create({
      data: {
        title,
        content,
        image_uri,
        user: { connect: { id: user_id } },
        tags: tags
          ? {
              connectOrCreate: tags.map((tag) => ({
                where: { name: tag },
                create: { name: tag },
              })),
            }
          : undefined,
      },
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
}
