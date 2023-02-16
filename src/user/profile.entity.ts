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

  // 因为user实体已经设置了CASCADE profile实体，所以profile实体就不能再CASCADE User实体
  @OneToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  // @JoinColumn({ name: 'uid' }) // 设置name，默认是userId
  @JoinColumn() // 设置name，默认是userId
  user: User;
}
