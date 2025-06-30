import { Body, Controller, Post } from '@nestjs/common';
import { Public } from 'src/shared/decorator/public.decorator';
import { LoginUseCase } from './use-cases/login.use-case';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  @Public()
  @Post('sign-in')
  async login(@Body() body: LoginDto) {
    return this.loginUseCase.execute(body);
  }
}
