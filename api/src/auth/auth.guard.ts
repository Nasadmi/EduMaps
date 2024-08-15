import {
  type CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

import { type Request } from 'express';

export interface PayloadInterface {
  user: {
    sub: string;
    username: string;
    iat: number;
    exp: number;
  };
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const bearer = request.headers.bearer as string;
    if (!bearer) {
      throw new UnauthorizedException('The bearer is invalid');
    }
    try {
      const payload = await this.jwtService.verifyAsync(bearer, {
        secret: process.env.JWT_KEY,
      });
      console.log(payload);
      request['user'] = payload;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('Bearer authorization error');
    }
    return true;
  }
}
