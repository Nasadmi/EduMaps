import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  Repository,
  UpdateEvent,
} from 'typeorm';
import { User } from 'src/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Markmaps } from 'src/entities/markmaps.entity';

@EventSubscriber()
@Injectable()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  constructor(
    dataSource: DataSource,
    @InjectRepository(Markmaps)
    private readonly markmapsRepository: Repository<Markmaps>,
  ) {}

  listenTo() {
    return User;
  }

  async afterUpdate(event: UpdateEvent<User>) {
    try {
      if (event.entity.username) {
        const { username, id } = event.entity;

        await event.queryRunner.query(
          'UPDATE markmaps SET author = ? WHERE userId = ?',
          [username, id],
        );
      }
    } catch (error) {
      console.error('Error in afterUpdate subscriber:', error);
    }
  }
}
