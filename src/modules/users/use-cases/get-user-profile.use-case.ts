import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from '../domain/repository/user.model.repository';

@Injectable()
export class GetUserProfileUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) return null;

    const [follows, followeds] = await Promise.all([
      this.userRepository.countFollowing(userId),
      this.userRepository.countFollowers(userId),
    ]);

    const { password, ...profile } = user;

    return {
      ...profile,
      follows,
      followeds,
    };
  }
}
