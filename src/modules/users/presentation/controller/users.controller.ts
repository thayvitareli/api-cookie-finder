import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { Public } from '../../../../shared/decorator/public.decorator';
import { RegisterUserUseCase } from '../../use-cases/register-user.use-case';
import { CreateUserDto } from '../dto/create-user.dto';
import { GetUserProfileUseCase } from '../../use-cases/get-user-profile.use-case';

@Controller('users')
export class UsersController {
  constructor(
    private readonly registerUser: RegisterUserUseCase,
    private readonly getUserProfileUseCase: GetUserProfileUseCase,
  ) {}

  @Public()
  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.registerUser.execute(createUserDto);
  }

  @Public()
  @Get(':id')
  getProfile(@Param('id') id: string) {
    return this.getUserProfileUseCase.execute(id);
  }
}
