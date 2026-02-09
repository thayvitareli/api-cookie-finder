import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from '../domain/repository/user.model.repository';

@Injectable()
export class UnfollowUserUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(followingId: string, followerId: string) {
    if (followingId === followerId) {
      throw new BadRequestException('Não é possível deixar de seguir a si mesmo.');
    }

    return this.userRepository.unfollow(followerId, followingId);
  }
}
