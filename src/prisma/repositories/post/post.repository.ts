import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { IPostRepository } from '../../../modules/posts/domain/repository/post.repository.interface';
import { PostComment } from '../../../modules/posts/domain/model/post-comment.model';
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

  async findById(id: string, userId?: string): Promise<Post | null> {
    const data = await this.prisma.post.findUnique({
      where: { id },
      include: {
        tags: true,
        user: true,
        saved_posts: userId ? { where: { user_id: userId } } : false,
      },
    });

    if (!data) return null;

    return new Post({
      id: data.id,
      title: data.title,
      content: data.content,
      image_uri: data.image_uri ?? undefined,
      user_id: data.user_id,
      tags: data.tags.map((t) => t.name),
      author: {
        id: data.user.id,
        name: data.user.name,
        avatar: data.user.avatar,
      },
      is_saved: data.saved_posts ? data.saved_posts.length > 0 : false,
      created_at: data.created_at,
      updated_at: data.updated_at,
    });
  }

  async findAll(filters: {
    skip?: number;
    take?: number;
    tag_ids?: string[];
    userId?: string;
  }): Promise<{ total: number; records: Post[] }> {
    const { skip, take, tag_ids, userId } = filters;

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
        include: {
          tags: true,
          user: true,
          saved_posts: userId ? { where: { user_id: userId } } : false,
        },
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
            author: {
              id: item.user.id,
              name: item.user.name,
              avatar: item.user.avatar,
            },
            is_saved: item.saved_posts ? item.saved_posts.length > 0 : false,
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

  async createComment(comment: PostComment): Promise<PostComment> {
    const { content, post_id, user_id } = comment;

    const data = await this.prisma.post_comment.create({
      data: {
        content,
        post: { connect: { id: post_id } },
        user: { connect: { id: user_id } },
      },
    });

    return new PostComment({
      id: data.id,
      content: data.content,
      post_id: data.post_id,
      user_id: data.user_id,
      created_at: data.created_at,
    });
  }

  async findCommentsByPostId(
    postId: string,
    filters: {
      skip?: number;
      take?: number;
    },
  ): Promise<{ total: number; records: PostComment[] }> {
    const { skip, take } = filters;

    const where = {
      post_id: postId,
    };

    const [total, data] = await Promise.all([
      this.prisma.post_comment.count({ where }),
      this.prisma.post_comment.findMany({
        where,
        skip,
        take,
        include: { user: true },
        orderBy: { created_at: 'desc' },
      }),
    ]);

    return {
      total,
      records: data.map(
        (item) =>
          new PostComment({
            id: item.id,
            content: item.content,
            post_id: item.post_id,
            user_id: item.user_id,
            author: {
              id: item.user.id,
              name: item.user.name,
              avatar: item.user.avatar,
            },
            created_at: item.created_at,
          }),
      ),
    };
  }

  async findSavedPostsByUserId(
    userId: string,
    filters: {
      skip?: number;
      take?: number;
    },
  ): Promise<Post[]> {
    const { skip, take } = filters;

    const data = await this.prisma.post.findMany({
      where: {
        saved_posts: {
          some: {
            user_id: userId,
          },
        },
      },
      skip,
      take,
      include: { tags: true, user: true },
      orderBy: { created_at: 'desc' },
    });

    return data.map(
      (item) =>
        new Post({
          id: item.id,
          title: item.title,
          content: item.content,
          image_uri: item.image_uri ?? undefined,
          user_id: item.user_id,
          tags: item.tags.map((t) => t.name),
          author: {
            id: item.user.id,
            name: item.user.name,
            avatar: item.user.avatar,
          },
          created_at: item.created_at,
          updated_at: item.updated_at,
        }),
    );
  }

  async countSavedPostsByUserId(userId: string): Promise<number> {
    return this.prisma.post.count({
      where: {
        saved_posts: {
          some: {
            user_id: userId,
          },
        },
      },
    });
  }

  async save(postId: string, userId: string): Promise<void> {
    await this.prisma.saved_post.create({
      data: {
        post_id: postId,
        user_id: userId,
      },
    });
  }

  async unsave(postId: string, userId: string): Promise<void> {
    await this.prisma.saved_post.delete({
      where: {
        post_id_user_id: {
          post_id: postId,
          user_id: userId,
        },
      },
    });
  }
}
