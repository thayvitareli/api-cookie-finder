import { Injectable } from '@nestjs/common';
import { user, Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.userCreateInput): Promise<user> {
    return this.prisma.user.create({
      data,
    });
  }

  async findOne(where: Prisma.userWhereInput): Promise<user> {
    return this.prisma.user.findFirst({
      where,
    });
  }

  async update(
    where: Prisma.userWhereUniqueInput,
    data: Prisma.userUpdateInput,
  ): Promise<user> {
    return this.prisma.user.update({
      where,
      data,
    });
  }
}
