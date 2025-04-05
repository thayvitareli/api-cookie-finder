
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from 'prisma/repositories/user.repository';
import errorMessages from 'src/shared/consts/error-messages';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
    constructor(
        private userRepository: UserRepository,
        private jwtService: JwtService,
      ) {}
    
      async validateUser(email: string, pass: string) {
        const user = await this.userRepository.findOne({ email });
        if (user) {
          if (bcrypt.compare(pass, user.password)) {
            const { password, ...result } = user;
            return result;
          }
          throw new UnauthorizedException(errorMessages.loginFailed);
        }
        throw new UnauthorizedException(errorMessages.loginFailed);
      }
    
      async login({ email, password }: LoginDto) {
        const user = await this.validateUser(email, password);
    
        return {
          name: user.name,
          email: user.email,
          access_token: this.jwtService.sign({ userId: user.id }),
        };
      }
    
}
