import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from 'prisma/repositories/user.repository';
import { CreateUserDto } from '../dto/create-user.dto';
import errorMessages from 'src/shared/consts/error-messages';
import { User } from '../entities/user.entity';
import { IHashPasswordProvider } from 'src/shared/hash-password-provider/hasy-password-provider.interface';

@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
     @Inject('IHashPasswordProvider')
    private readonly hashProvider: IHashPasswordProvider,
  ) {}

  async execute(input: CreateUserDto) {
    const { email, name, password } = input;

    const hashPass = await this.hashProvider.hash(password)

    const emailInUse = await this.userRepository.findByEmail(email);

    if (emailInUse) throw new BadRequestException(errorMessages.emailInUse);

    const user = new User({email, name, password: hashPass })

    await this.userRepository.create(user);

    delete user['password'];

    return user
  }
}
