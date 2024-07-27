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
    });
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

  async getAllMarkmapOfUser(id: string /** token: string */) {
    return await this.markmapsRepository.find({
      where: { user: { id } },
      order: { created_at: 'DESC' },
      relations: { user: true },
      select: { user: { id: true } },
      take: 10,
    });
  }

  async getOneMarkmap(id: number /** token: string */) {
    return await this.markmapsRepository.findOne({ where: { id } });
  }

  async updateMarkmap(
    id: number,
    markmap: UpdateMarkmapsDTO,
    /** token: string */
  ): Promise<UpdateResult> | null {
    if (!(await this.markmapsRepository.findOne({ where: { id: id } }))) {
      return null;
    }
    return await this.markmapsRepository.update(id, markmap);
  }

  async deleteMarkmap(
    id: number /** token: string */,
  ): Promise<DeleteResult> | null {
    if (!(await this.markmapsRepository.findOne({ where: { id: id } }))) {
      return null;
    }
    return await this.markmapsRepository.delete(id);
  }
}
