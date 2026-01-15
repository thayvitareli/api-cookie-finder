import { Inject, UnauthorizedException } from '@nestjs/common';
import { IUserRepository } from 'prisma/repositories/user/user.repository';
import * as bcrypt from 'bcrypt';
import errorMessages from 'src/shared/consts/error-messages';
import { LoginDto } from '../dto/login.dto';
import { JwtService } from '@nestjs/jwt';

export class LoginUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    private jwtService: JwtService,
  ) {}

  async execute({ email, password }: LoginDto) {
    const user = await this.validateUser(email, password);

    return {
      name: user.name,
      email: user.email,
      access_token: this.jwtService.sign({ userId: user.id }),
    };
  }

  async validateUser(email: string, pass: string) {
    const user = await this.userRepository.findByEmail(email);
    if (user) {
      if (bcrypt.compare(pass, user.password)) {
        const { password, ...result } = user;
        return result;
      }
      throw new UnauthorizedException(errorMessages.loginFailed);
    }
    throw new UnauthorizedException(errorMessages.loginFailed);
  }
}
