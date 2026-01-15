import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import errorMessages from 'src/shared/consts/error-messages';
import { IHashPasswordProvider } from 'src/shared/hash-password-provider/hasy-password-provider.interface';
import { IUserRepository } from '../domain/repository/user.model.repository';
import { User } from '../domain/model/user.model';
import { CreateUserDto } from '../presentation/dto/create-user.dto';

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

    const hashPass = await this.hashProvider.hash(password);

    const emailInUse = await this.userRepository.findByEmail(email);

    if (emailInUse) throw new BadRequestException(errorMessages.emailInUse);

    const user = new User({ email, name, password: hashPass });

    await this.userRepository.create(user);

    delete user['password'];

    return user;
  }
}
