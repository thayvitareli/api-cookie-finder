import { Module } from '@nestjs/common';
import { DatabaseModule } from 'prisma/database.module';
import { FollowUserUseCase } from './use-cases/follow-user.use-case';
import { GetUserProfileUseCase } from './use-cases/get-user-profile.use-case';
import { RegisterUserUseCase } from './use-cases/register-user.use-case';
import { UnfollowUserUseCase } from './use-cases/unfollow-user.use-case';
import { UserRepository } from 'prisma/repositories/user/user.repository';
import { HashPasswordProvider } from 'src/shared/hash-password-provider/hash-passoword-provider';
import { UsersController } from './presentation/controller/users.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [UsersController],
  providers: [
    RegisterUserUseCase,
    FollowUserUseCase,
    UnfollowUserUseCase,
    GetUserProfileUseCase,
    {
      provide: 'IUserRepository',
      useExisting: UserRepository,
    },
    {
      provide: 'IHashPasswordProvider',
      useClass: HashPasswordProvider,
    },
  ],
})
export class UsersModule {}
