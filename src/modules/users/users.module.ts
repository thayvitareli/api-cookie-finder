import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { DatabaseModule } from 'prisma/database.module';
import { RegisterUserUseCase } from './use-cases/register-user.use-case';
import { UserRepository } from 'prisma/repositories/user.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [UsersController],
  providers: [
    RegisterUserUseCase,
    {
      provide: 'IUserRepository',
      useExisting: UserRepository,
    },
  ],
})
export class UsersModule {}
