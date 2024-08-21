import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  username: string;

  @Column({ unique: true, type: 'varchar', length: 500 })
  email: string;

  @Column('varchar')
  password: string;

  @Column({ type: 'text', nullable: true })
  img: string | null;

  @Column({ type: 'varchar', nullable: false, default: '[]' })
  markmapsWithStars: number[];
}
