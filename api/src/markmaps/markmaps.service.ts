import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  type DeleteResult,
  FindOptionsWhere,
  LessThanOrEqual,
  type UpdateResult,
  type Repository,
} from 'typeorm';
import { Markmaps } from 'src/entities/markmaps.entity';
import {
  FindMarkmaps,
  MarkmapsDTO,
  UpdateMarkmapsDTO,
} from 'src/dto/markmaps.dto';

@Injectable()
export class MarkmapsService {
  constructor(
    @InjectRepository(Markmaps)
    private readonly markmapsRepository: Repository<Markmaps>,
  ) {}

  async createMarkmap(markmap: MarkmapsDTO) {
    return await this.markmapsRepository.save(markmap);
  }

  async getAllMarkmaps(maxStars?: number) {
    const where: FindOptionsWhere<Markmaps> = {
      public: 1,
    };
    if (maxStars) {
      where.stars = LessThanOrEqual(maxStars);
    }
    return await this.markmapsRepository.find({
      order: { stars: 'DESC' },
      where,
      take: 20,
      select: {
        name: true,
        author: true,
        created_at: true,
        stars: true,
        id: true,
      },
    });
  }

  async addStar(id: number, fromUser: string) {
    const markmap = await this.markmapsRepository.findOne({
      where: { id },
    });

    if (markmap === null) {
      return false;
    }

    try {
      this.markmapsRepository.update(id, { stars: markmap.stars++ });
      const userStars = JSON.parse(
        await this.markmapsRepository.query(
          'SELECT markmapsWithStars FROM user WHERE id = ?'[fromUser],
        ),
      ) as number[];

      userStars.push(id);

      await this.markmapsRepository.query(
        'UPDATE user SET markmapsWithStars = ? WHERE id = ?',
        [userStars, fromUser],
      );
    } catch (error) {
      console.error(error);
    }
  }

  async getMarkmapByAuthorAndName(
    data: FindMarkmaps,
  ): Promise<Markmaps[]> | null {
    const { author, name } = data;
    const where: FindMarkmaps & { public?: number } = {};

    where.public = 1;

    if (!author && !name) {
      return null;
    }

    if (author) {
      where.author = author;
    }

    if (name) {
      where.name = name;
    }

    return await this.markmapsRepository.find({ where });
  }

  async getAllMarkmapOfUser(id: string) {
    return await this.markmapsRepository.find({
      where: { user: { id } },
      order: { created_at: 'DESC' },
      relations: { user: true },
      select: { user: { id: true } },
      take: 10,
    });
  }

  async getOneMarkmap(id: number) {
    return await this.markmapsRepository.findOne({ where: { id } });
  }

  async updateMarkmap(
    id: number,
    markmap: UpdateMarkmapsDTO,
    token: string,
  ): Promise<false | null | UpdateResult> {
    const toUpdateMarkmap = await this.markmapsRepository.findOne({
      where: { id: id },
    });
    if (!toUpdateMarkmap) {
      return null;
    }
    if (toUpdateMarkmap.user.id !== token) {
      return false;
    }
    return await this.markmapsRepository.update(id, markmap);
  }

  async deleteMarkmap(
    id: number,
    token: string,
  ): Promise<false | null | DeleteResult> {
    const toDeleteMarkmap = await this.markmapsRepository.findOne({
      where: { id: id },
    });
    if (!toDeleteMarkmap) {
      return null;
    }

    if (toDeleteMarkmap.user.id !== token) {
      return false;
    }
    return await this.markmapsRepository.delete(id);
  }
}
