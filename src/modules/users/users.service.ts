import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from 'prisma/repositories/user.repository';
import * as bcrypt from 'bcrypt'
import errorMessages from 'src/shared/consts/error-messages';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository:UserRepository){}

  async create({email, name, password}: CreateUserDto) {
    const hashPass = await bcrypt.hash(password, Number(process.env.SALT))

    const emailInUse = await this.userRepository.findOne({email})

    if(emailInUse) throw new BadRequestException(errorMessages.emailInUse)
      
    return this.userRepository.create({
      email,
      password,
      name
    });
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
