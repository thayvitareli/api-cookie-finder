import { Body, Controller, Post, UseGuards, Req } from '@nestjs/common';
import { Public } from '../../shared/decorator/public.decorator';
import { LoginUseCase } from './use-cases/login.use-case';
import { LoginDto } from './dto/login.dto';
import { GoogleAuthGuard } from './guard/google-auth.guard';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly jwtService: JwtService,
  ) {}

  @Public()
  @Post('sign-in')
  async login(@Body() body: LoginDto) {
    return this.loginUseCase.execute(body);
  }

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Post('google-login')
  async googleLogin(@Req() req) {
    const user = req.user;
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      access_token: this.jwtService.sign({ userId: user.id }),
    };
  }
}
