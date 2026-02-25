import { Inject, Injectable } from '@nestjs/common';
import { IPostRepository } from '../domain/repository/post.repository.interface';
import { PostComment } from '../domain/model/post-comment.model';

export interface ListPostCommentsRequest {
  postId: string;
  skip?: number;
  take?: number;
}

export interface ListPostCommentsResponse {
  total: number;
  records: PostComment[];
}

@Injectable()
export class ListPostCommentsUseCase {
  constructor(
    @Inject('IPostRepository')
    private readonly postRepository: IPostRepository,
  ) {}

  async execute(request: ListPostCommentsRequest): Promise<ListPostCommentsResponse> {
    const { total, records } = await this.postRepository.findCommentsByPostId(
      request.postId,
      {
        skip: request.skip !== undefined ? Number(request.skip) : undefined,
        take: request.take !== undefined ? Number(request.take) : undefined,
      },
    );

    return {
      total,
      records,
    };
  }
}
