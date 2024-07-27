import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsNumber,
  MaxLength,
} from 'class-validator';

import { User } from 'src/entities/user.entity';

export class MarkmapsDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsString()
  @IsNotEmpty()
  script: string;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  user: Pick<User, 'id'>;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  author: string;

  stars?: number;

  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 0 })
  public: number;
}

export type UpdateMarkmapsDTO = Partial<Omit<MarkmapsDTO, 'user' | 'author'>>;

export interface FindMarkmaps {
  name?: string;
  author?: string;
}
