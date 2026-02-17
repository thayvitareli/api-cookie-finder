import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { DatabaseModule } from 'prisma/database.module';
import { AuthController } from './auth.controller';
import { UserRepository } from 'prisma/repositories/user/user.repository';
import { LoginUseCase } from './use-cases/login.use-case';
import { GoogleStrategy } from './strategy/google.strategy';
import { GoogleAuthGuard } from './guard/google-auth.guard';

@Module({
  controllers: [AuthController],
  imports: [
    DatabaseModule,
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '7d' },
      }),
    }),
  ],
  providers: [
    LoginUseCase,
    JwtStrategy,
    GoogleStrategy,
    GoogleAuthGuard,
    {
      provide: 'IUserRepository',
      useExisting: UserRepository,
    },
  ],
})
export class AuthModule {}
