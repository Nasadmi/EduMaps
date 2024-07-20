import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { type DeleteResult, type Repository, type UpdateResult } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { UpdateUserDTO, UserDTO } from 'src/dto/users.dto';
import { hash } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  async findUserByEmailOrUsername(
    type: 'email' | 'username',
    data: string,
  ): Promise<User | null> {
    if (type === 'email') {
      return await this.usersRepository.findOne({ where: { email: data } });
    } else {
      return await this.usersRepository.findOne({ where: { username: data } });
    }
  }

  async findUserById(id: string): Promise<User | null> {
    return await this.usersRepository.findOne({ where: { id: id } });
  }

  async createUser(user: UserDTO): Promise<UserDTO & User> {
    user.password = await hash(user.password, 8);
    return await this.usersRepository.save(user);
  }

  async updateUser(
    user: UpdateUserDTO,
    id: string,
  ): Promise<UpdateResult> | null {
    if (!(await this.usersRepository.findOne({ where: { id: id } }))) {
      return null;
    }
    return await this.usersRepository.update(id, user);
  }

  async deleteUser(id: string): Promise<DeleteResult> | null {
    if (!(await this.usersRepository.findOne({ where: { id: id } }))) {
      return null;
    }
    return await this.usersRepository.delete(id);
  }
}
