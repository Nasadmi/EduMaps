import {
  Body,
  Controller,
  Get,
  Post,
  Delete,
  Put,
  ConflictException,
  NotFoundException,
  HttpException,
  HttpStatus,
  BadRequestException,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDTO, UpdateUserDTO } from 'src/dto/users.dto';
import { isBase64 } from 'class-validator';
import { AuthGuard, PayloadInterface } from 'src/auth/auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Get()
  async getUser(@Request() req: PayloadInterface) {
    const user = await this.userService.findUserById(req.user.sub);
    if (!user) {
      throw new NotFoundException('The user does not exist');
    }
    return user;
  }

  @Post()
  async createUser(@Body() user: UserDTO) {
    if (user.img !== undefined && isBase64(user.img) === false) {
      throw new BadRequestException('Image must be a base64');
    }
    try {
      return await this.userService.createUser(user);
    } catch (error) {
      if (error.errno === 1062) {
        throw new ConflictException('The user already exists');
      }
    }
  }

  @UseGuards(AuthGuard)
  @Delete()
  async deleteUser(@Request() req: PayloadInterface) {
    const remove = await this.userService.deleteUser(req.user.sub);
    if (!remove) {
      throw new NotFoundException('The user does not exist');
    }
    throw new HttpException('The user has been deleted', HttpStatus.OK);
  }

  @UseGuards(AuthGuard)
  @Put()
  async updateUser(
    @Request() req: PayloadInterface,
    @Body() user: UpdateUserDTO & { id?: string },
  ) {
    try {
      if (user.username) {
        user.id = req.user.sub;
      }
      if (user.img !== undefined && isBase64(user.img) === false) {
        throw new BadRequestException('Image must be a base64');
      }
      const updated = await this.userService.updateUser(user, req.user.sub);
      if (!updated) {
        throw new NotFoundException('The user does not exist');
      }
      throw new HttpException('The user has been updated', HttpStatus.OK);
    } catch (error) {
      if (error.errno === 1062) {
        throw new ConflictException('A user with this username already exists');
      }
    }
  }
}
