import {
  IRecipeRepository,
  RecipeRepository,
} from 'prisma/repositories/recipe.repository';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from 'prisma/repositories/user.repository';
import { CreateUserDto } from '../dto/create-user.dto';
import errorMessages from 'src/shared/consts/error-messages';
import * as bcrypt from 'bcrypt';

@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(input: CreateUserDto) {
    const { email, name, password } = input;

    const hashPass = await bcrypt.hash(password, Number(process.env.SALT));

    const emailInUse = await this.userRepository.findOne({ email });

    if (emailInUse) throw new BadRequestException(errorMessages.emailInUse);

    return this.userRepository.create({
      email,
      password: hashPass,
      name,
    });
  }
}
