import { Module } from '@nestjs/common';
import { DatabaseModule } from 'prisma/database.module';
import { RegisterUserUseCase } from './use-cases/register-user.use-case';
import { UserRepository } from 'prisma/repositories/user/user.repository';
import { HashPasswordProvider } from 'src/shared/hash-password-provider/hash-passoword-provider';
import { UsersController } from './presentation/controller/users.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [UsersController],
  providers: [
    RegisterUserUseCase,
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
