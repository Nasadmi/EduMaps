import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { isEmpty } from 'class-validator';
import { PayloadInterface } from './auth.guard';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signToken({
    method,
    data,
    password,
  }: {
    method: 'username' | 'email';
    data: string;
    password: string;
  }): Promise<false | { access_token: string }> {
    const user = await this.userService.findUserByEmailOrUsername(method, data);

    if (!user) {
      return false;
    }

    if (!(await compare(password, user.password))) {
      return false;
    }

    const payload = {
      sub: user.id,
      username: user.username,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async updateToken(
    token: string,
  ): Promise<false | null | { access_token: string }> {
    if (isEmpty(token)) {
      return null;
    }
    try {
      const payload = {
        ...(
          await this.jwtService.verifyAsync<PayloadInterface>(token, {
            secret: process.env.JWT_KEY,
          })
        ).user,
      };
      return {
        access_token: await this.jwtService.signAsync({
          sub: payload.sub,
          username: payload.username,
        }),
      };
    } catch (error) {
      return false;
    }
  }
}
