import { User } from '../model/user.model';

export interface IUserRepository {
  create(user: User): Promise<void>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  update(user: User): Promise<void>;
  delete(id: string): Promise<void>;
  follow(followerId: string, followingId: string): Promise<void>;
  unfollow(followerId: string, followingId: string): Promise<void>;
  countFollowing(userId: string): Promise<number>;
  countFollowers(userId: string): Promise<number>;
}
