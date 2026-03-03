import { Inject, Injectable } from '@nestjs/common';
import { IPostRepository } from '../domain/repository/post.repository.interface';

@Injectable()
export class SavePostUseCase {
  constructor(
    @Inject('IPostRepository')
    private readonly postRepository: IPostRepository,
  ) {}

  async execute(postId: string, userId: string) {
    return this.postRepository.save(postId, userId);
  }
}
