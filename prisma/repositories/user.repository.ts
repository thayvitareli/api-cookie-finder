import { Injectable } from '@nestjs/common';
import { user, Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { User } from 'src/modules/users/entities/user.entity';

export interface IUserRepository {
  create(user: User): Promise<void>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  update(user: User): Promise<void>;
  delete(id: string): Promise<void>;
}


@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private prisma: PrismaService) {}
 

  async create(user: User): Promise<void> {
    await this.prisma.user.create({
      data: {
        email: user.email,
        name: user.name, 
        avatar: user.avatar,
        password: user.password,
      },
    });
  }

  async findById(id: string): Promise<User | null>{
    const data = await this.prisma.user.findFirst({
      where: {id}
    })

    return data ? new User(data) : null

    }


  async findByEmail(email: string): Promise<User> {
    const data = await this.prisma.user.findFirst({
      where: { email }
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
      where: { id}
    })
  }

}



