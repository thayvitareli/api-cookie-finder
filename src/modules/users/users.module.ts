import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { DatabaseModule } from 'prisma/database.module';
import { RegisterUserUseCase } from './use-cases/register-user.use-case';
import { UserRepository } from 'prisma/repositories/user.repository';
import { HashPasswordProvider } from 'src/shared/hash-password-provider/hash-passoword-provider';

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
