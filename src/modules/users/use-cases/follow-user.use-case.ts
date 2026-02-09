import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from '../domain/repository/user.model.repository';

@Injectable()
export class FollowUserUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(followingId: string, followerId: string) {
    if (followingId === followerId) {
      throw new BadRequestException('Não é possível seguir a si mesmo.');
    }

    return this.userRepository.follow(followerId, followingId);
  }
}
