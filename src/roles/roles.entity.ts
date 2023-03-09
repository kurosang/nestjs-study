import { User } from '../user/user.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Menus } from '../menus/menus.entity';

@Entity()
export class Roles {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => User, (user) => user.roles)
  users: User[];

  // 一个role对应多个menu及控制权限
  @ManyToMany(() => Menus, (menus) => menus.role)
  menus: Menus[];
}
