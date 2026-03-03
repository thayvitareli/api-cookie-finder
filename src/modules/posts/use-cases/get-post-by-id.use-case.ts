import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IPostRepository } from '../domain/repository/post.repository.interface';
import { Post } from '../domain/model/post.model';

@Injectable()
export class GetPostByIdUseCase {
  constructor(
    @Inject('IPostRepository')
    private postRepository: IPostRepository,
  ) {}

  async execute(id: string, userId?: string): Promise<Post> {
    const post = await this.postRepository.findById(id, userId);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }
}
