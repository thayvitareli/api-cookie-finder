import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IPostRepository } from '../domain/repository/post.repository.interface';
import { PostComment } from '../domain/model/post-comment.model';

interface CreatePostCommentInput {
  postId: string;
  userId: string;
  content: string;
}

@Injectable()
export class CreatePostCommentUseCase {
  constructor(
    @Inject('IPostRepository')
    private readonly postRepository: IPostRepository,
  ) {}

  async execute(input: CreatePostCommentInput): Promise<PostComment> {
    const post = await this.postRepository.findById(input.postId);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const comment = new PostComment({
      post_id: input.postId,
      user_id: input.userId,
      content: input.content,
    });

    return this.postRepository.createComment(comment);
  }
}
