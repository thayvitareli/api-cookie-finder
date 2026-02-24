import { Injectable, Inject } from '@nestjs/common';
import { IPostRepository, FindAllTagsOutput } from '../domain/repository/post.repository.interface';

@Injectable()
export class ListPostTagsUseCase {
  constructor(
    @Inject('IPostRepository')
    private readonly postRepository: IPostRepository,
  ) {}

  async execute(): Promise<FindAllTagsOutput> {
    return this.postRepository.findAllTags();
  }
}
