import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Delete,
  Put,
  ConflictException,
  NotFoundException,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDTO, UpdateUserDTO } from 'src/dto/users.dto';
import { isBase64 } from 'class-validator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async getUser(@Param('id') id: string) {
    const user = await this.userService.findUserById(id);
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

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    const remove = await this.userService.deleteUser(id);
    if (!remove) {
      throw new NotFoundException('The user does not exist');
    }
    throw new HttpException('The user has been deleted', HttpStatus.OK);
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() user: UpdateUserDTO & { id?: string },
  ) {
    try {
      if (user.username) {
        user.id = id;
      }
      if (user.img !== undefined && isBase64(user.img) === false) {
        throw new BadRequestException('Image must be a base64');
      }
      const updated = await this.userService.updateUser(user, id);
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
