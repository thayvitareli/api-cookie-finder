import { Inject, Injectable } from '@nestjs/common';
import { IPostRepository } from '../domain/repository/post.repository.interface';
import { IStorageProvider } from '../../storage/domain/provider/storage.provider.interface';
import { Post } from '../domain/model/post.model';

export interface ListPostsRequest {
  skip?: number;
  take?: number;
  tag_ids?: string[];
}

export interface ListPostsResponse {
  total: number;
  records: Post[];
}

@Injectable()
export class ListPostsUseCase {
  constructor(
    @Inject('IPostRepository')
    private readonly postRepository: IPostRepository,
    @Inject('IStorageProvider')
    private readonly storageProvider: IStorageProvider,
  ) {}

  async execute(request: ListPostsRequest): Promise<ListPostsResponse> {
    const { total, records } = await this.postRepository.findAll({
      skip: request.skip !== undefined ? Number(request.skip) : undefined,
      take: request.take !== undefined ? Number(request.take) : undefined,
      tag_ids: request.tag_ids,
    });

    const postsWithPublicUrls = await Promise.all(
      records.map(async (post) => {
        if (post.image_uri && !post.image_uri.startsWith('http')) {
          post.image_uri = await this.storageProvider.getImageUrl(post.image_uri);
        }
        return post;
      }),
    );

    return {
      total,
      records: postsWithPublicUrls,
    };
  }
}
