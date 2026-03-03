import { Inject, Injectable } from '@nestjs/common';
import { IPostRepository } from '../domain/repository/post.repository.interface';
import { IStorageProvider } from '../../storage/domain/provider/storage.provider.interface';
import { Post } from '../domain/model/post.model';

export interface ListSavedPostsRequest {
  user_id: string;
  skip?: number;
  take?: number;
}

export interface ListSavedPostsResponse {
  total: number;
  records: Post[];
}

@Injectable()
export class ListSavedPostsUseCase {
  constructor(
    @Inject('IPostRepository')
    private readonly postRepository: IPostRepository,
    @Inject('IStorageProvider')
    private readonly storageProvider: IStorageProvider,
  ) {}

  async execute(request: ListSavedPostsRequest): Promise<ListSavedPostsResponse> {
    const filters = {
      skip: request.skip !== undefined ? Number(request.skip) : undefined,
      take: request.take !== undefined ? Number(request.take) : undefined,
    };

    const [total, records] = await Promise.all([
      this.postRepository.countSavedPostsByUserId(request.user_id),
      this.postRepository.findSavedPostsByUserId(request.user_id, filters),
    ]);

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
