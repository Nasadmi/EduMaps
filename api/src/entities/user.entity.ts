import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, type: 'varchar' })
  username: string;

  @Column({ unique: true, type: 'varchar' })
  email: string;

  @Column('varchar')
  password: string;

  @Column({ type: 'text', nullable: true })
  img: string | null;
}
