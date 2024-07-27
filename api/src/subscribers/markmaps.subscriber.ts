import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { Markmaps } from 'src/entities/markmaps.entity';
import { BadRequestException } from '@nestjs/common';

@EventSubscriber()
export class MarkmapsSubscriber implements EntitySubscriberInterface<Markmaps> {
  constructor(dataSource: DataSource) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return Markmaps;
  }

  async beforeInsert(event: InsertEvent<Markmaps>) {
    const markmaps =
      (await event.manager.countBy(Markmaps, {
        author: event.entity.author,
        name: event.entity.name,
      })) + 1;
    if (markmaps >= 2) {
      throw new BadRequestException(
        'The user already has a markmap with this name.',
      );
    }
  }

  async beforeUpdate(event: UpdateEvent<Markmaps>) {
    if (event.entity.name) {
      const markmaps =
        (await event.manager.countBy(Markmaps, {
          author: event.entity.author,
          name: event.entity.name,
        })) + 1;

      if (markmaps >= 2) {
        throw new BadRequestException(
          'The user already has a markmap with this name.',
        );
      }
    }
  }
}
