import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { User } from 'src/modules/users/domain/model/user.model';
import { IUserRepository } from 'src/modules/users/domain/repository/user.model.repository';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private prisma: PrismaService) {}

  async create(user: User): Promise<User> {
    const data =await this.prisma.user.create({
      data: {
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        password: user.password,
      },
    });

    return new User(data);
  }

  async findById(id: string): Promise<User | null> {
    const data = await this.prisma.user.findFirst({
      where: { id },
    });

    return data ? new User(data) : null;
  }

  async findByEmail(email: string): Promise<User> {
    const data = await this.prisma.user.findFirst({
      where: { email },
    });

    return data ? new User(data) : null;
  }

  async update(user: User): Promise<void> {
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        name: user.name,
        avatar: user.avatar,
        password: user.password,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }

  async follow(followerId: string, followingId: string): Promise<void> {
    await this.prisma.user_follow.upsert({
      where: {
        follower_id_following_id: {
          follower_id: followerId,
          following_id: followingId,
        },
      },
      update: {},
      create: {
        follower: { connect: { id: followerId } },
        following: { connect: { id: followingId } },
      },
    });
  }

  async unfollow(followerId: string, followingId: string): Promise<void> {
    await this.prisma.user_follow.deleteMany({
      where: {
        follower_id: followerId,
        following_id: followingId,
      },
    });
  }

  async countFollowing(userId: string): Promise<number> {
    return this.prisma.user_follow.count({
      where: { follower_id: userId },
    });
  }

  async countFollowers(userId: string): Promise<number> {
    return this.prisma.user_follow.count({
      where: { following_id: userId },
    });
  }
}
