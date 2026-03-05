import { Controller, Post, Body, Get, Param, UseGuards, Request, Delete } from '@nestjs/common';
import { Public } from '../../../../shared/decorator/public.decorator';
import { RegisterUserUseCase } from '../../use-cases/register-user.use-case';
import { CreateUserDto } from '../dto/create-user.dto';
import { GetUserProfileUseCase } from '../../use-cases/get-user-profile.use-case';
import { FollowUserUseCase } from '../../use-cases/follow-user.use-case';
import { UnfollowUserUseCase } from '../../use-cases/unfollow-user.use-case';
import { JwtAuthGuard } from '../../../auth/guard/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(
    private readonly registerUser: RegisterUserUseCase,
    private readonly getUserProfileUseCase: GetUserProfileUseCase,
    private readonly followUserUseCase: FollowUserUseCase,
    private readonly unfollowUserUseCase: UnfollowUserUseCase,
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

  @Post(':id/follow')
  @UseGuards(JwtAuthGuard)
  follow(@Param('id') id: string, @Request() req: any) {
    const userId = req.user.userId;
    return this.followUserUseCase.execute(id, userId);
  }

  @Delete(':id/follow')
  @UseGuards(JwtAuthGuard)
  unfollow(@Param('id') id: string, @Request() req: any) {
    const userId = req.user.userId;
    return this.unfollowUserUseCase.execute(id, userId);
  }
}
