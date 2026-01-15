import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { DatabaseModule } from 'prisma/database.module';
import { AuthController } from './auth.controller';
import { UserRepository } from 'prisma/repositories/user/user.repository';
import { LoginUseCase } from './use-cases/login.use-case';

@Module({
  controllers: [AuthController],
  imports: [
    DatabaseModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
  ],
  providers: [
    LoginUseCase,
    JwtStrategy,
    {
      provide: 'IUserRepository',
      useExisting: UserRepository,
    },
  ],
})
export class AuthModule {}
