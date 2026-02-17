import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import errorMessages from '../../../shared/consts/error-messages';
import { LoginUseCase } from './login.use-case';
import { IUserRepository } from '../../users/domain/repository/user.model.repository';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

describe('LoginUseCase', () => {
  const jwtService = {
    sign: jest.fn(),
  } as unknown as JwtService;

  const userRepository: Pick<IUserRepository, 'findByEmail'> = {
    findByEmail: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should login usersuccessfully and return a token.', async () => {
    (userRepository.findByEmail as jest.Mock).mockResolvedValue({
      id: 'user-1',
      name: 'Ana',
      email: 'ana@example.com',
      password: 'hashed',
    });

    (bcrypt.compare as unknown as jest.Mock).mockResolvedValue(true);
    (jwtService.sign as jest.Mock).mockReturnValue('token-123');

    const useCase = new LoginUseCase(
      userRepository as IUserRepository,
      jwtService,
    );

    const result = await useCase.execute({
      email: 'ana@example.com',
      password: 'secret123',
    });

    expect(userRepository.findByEmail).toHaveBeenCalledWith('ana@example.com');
    expect(bcrypt.compare).toHaveBeenCalledWith('secret123', 'hashed');
    expect(jwtService.sign).toHaveBeenCalledWith({ userId: 'user-1' });
    expect(result).toEqual({
      name: 'Ana',
      email: 'ana@example.com',
      access_token: 'token-123',
    });
  });

  it('should throw an UnauthorizedException if user not exist', async () => {
    (userRepository.findByEmail as jest.Mock).mockResolvedValue(null);

    const useCase = new LoginUseCase(
      userRepository as IUserRepository,
      jwtService,
    );

    await expect(
      useCase.execute({ email: 'x@example.com', password: 'secret123' }),
    ).rejects.toEqual(new UnauthorizedException(errorMessages.loginFailed));
  });

  it('should throw an UnauthorizedException it when password is invalid', async () => {
    (userRepository.findByEmail as jest.Mock).mockResolvedValue({
      id: 'user-1',
      name: 'Ana',
      email: 'ana@example.com',
      password: 'hashed',
    });
    (bcrypt.compare as unknown as jest.Mock).mockResolvedValue(false);

    const useCase = new LoginUseCase(
      userRepository as IUserRepository,
      jwtService,
    );

    await expect(
      useCase.execute({ email: 'ana@example.com', password: 'wrong' }),
    ).rejects.toEqual(new UnauthorizedException(errorMessages.loginFailed));
  });
});
