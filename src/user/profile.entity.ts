import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  gender: number;

  @Column()
  photo: string;

  @Column()
  address: string;

  @OneToOne(() => User, (user) => user.id)
  // @JoinColumn({ name: 'uid' }) // 设置name，默认是userId
  @JoinColumn() // 设置name，默认是userId
  user: User;
}
