// import { Logs } from '../logs/logs.entity';
import { Roles } from '../roles/roles.entity';
import {
  AfterInsert,
  AfterRemove,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Profile } from './profile.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  // // Typescript -> 数据库 关联关系 Mapping
  // @OneToMany(() => Logs, (logs) => logs.user)
  // logs: Logs[];

  @ManyToMany(() => Roles, (roles) => roles.users)
  @JoinTable({ name: 'users_roles' })
  roles: Roles[];

  @OneToOne(() => Profile, (profile) => profile.user, { cascade: true })
  profile: Profile;

  @AfterInsert()
  afterInsert() {
    console.log('AfterInsert', this.id);
  }

  @AfterRemove()
  afterRemove() {
    console.log('afterRemove');
  }
}
