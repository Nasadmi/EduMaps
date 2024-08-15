import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request as TypeRequest } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @HttpCode(HttpStatus.OK)
  @Post()
  async getToken(
    @Body()
    user: {
      method: 'username' | 'email';
      data: string;
      password: string;
    },
  ) {
    const auth = await this.authService.signToken({ ...user });

    if (!auth) {
      throw new BadRequestException(
        'The user does not exists or password is incorrect',
      );
    }

    return auth;
  }

  @Put()
  async updateToken(@Request() req: TypeRequest) {
    const newToken = await this.authService.updateToken(
      req.headers.bearer as string,
    );

    if (newToken === null) {
      throw new BadRequestException('The token is necessary');
    }

    if (newToken === false) {
      throw new ConflictException('The token is invalid or is expired');
    }

    return newToken;
  }
}
