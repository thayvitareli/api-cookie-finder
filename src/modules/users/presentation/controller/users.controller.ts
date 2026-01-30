import { Controller, Post, Body } from '@nestjs/common';
import { Public } from 'src/shared/decorator/public.decorator';
import { RegisterUserUseCase } from '../../use-cases/register-user.use-case';
import { CreateUserDto } from '../dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly registerUser: RegisterUserUseCase) {}

  @Public()
  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.registerUser.execute(createUserDto);
  }
}
