import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { OAuth2Client } from 'google-auth-library';
import { ConfigService } from '@nestjs/config';
import { IUserRepository } from '../../users/domain/repository/user.model.repository';
import { User } from '../../users/domain/model/user.model';
import * as bcrypt from 'bcrypt';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google-token') {
  private client: OAuth2Client;

  constructor(
    private configService: ConfigService,
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {
    super();
    this.client = new OAuth2Client(this.configService.get<string>('GOOGLE_CLIENT_ID'));
  }

  async validate(req: any): Promise<any> {
    const token = req.body.idToken;

    if (!token) {
      throw new UnauthorizedException('Token not provided');
    }

    try {
      const ticket = await this.client.verifyIdToken({
        idToken: token,
        audience: this.configService.get<string>('GOOGLE_CLIENT_ID'),
      });

      const payload = ticket.getPayload();
      if (!payload) {
        throw new UnauthorizedException('Invalid Google token');
      }

      const { email, name, picture } = payload;

      let user = await this.userRepository.findByEmail(email);

      if (!user) {
        const randomPassword = Math.random().toString(36).slice(-16);
        const hashedPassword = await bcrypt.hash(randomPassword, 10);

       const newUser = new User({
          name: name || 'Google User',
          email: email,
          password: hashedPassword,
          avatar: picture,
        });

        user = await this.userRepository.create(newUser);
      }

      delete user.password;

      return user;
    } catch (error) {
      throw new UnauthorizedException('Invalid Google token');
    }
  }
}
