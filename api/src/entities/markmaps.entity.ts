import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Markmaps {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text' })
  script: string;

  @ManyToOne(
    () => User,
    (user) => {
      user.id;
    },
  )
  user: User;

  @Column({ type: 'varchar', length: 255 })
  author: string;

  @Column({ type: 'decimal', precision: 1, scale: 0 })
  public: number;

  @Column({ type: 'int', default: 0 })
  stars: number;

  @CreateDateColumn()
  created_at: Date;
}
