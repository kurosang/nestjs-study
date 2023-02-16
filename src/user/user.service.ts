import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Roles } from '../roles/roles.entity';
import { conditionUtils } from '../utils/db.helper';
import { getUserDto } from './dto/get-user.dto';
// import { Logs } from '../logs/logs.entity';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>, // @InjectRepository(Logs) private readonly logsRepository: Repository<Logs>,
    @InjectRepository(Roles)
    private readonly rolesRepository: Repository<Roles>,
  ) {}

  findAll(query: getUserDto) {
    const { limit, page, username, gender, role } = query;
    const take = limit || 10;
    const skip = ((page || 1) - 1) * take; // 跳过多少条
    // return this.userRepository.find({
    //   select: {
    //     id: true,
    //     username: true,
    //     profile: {
    //       gender: true,
    //     },
    //   },
    //   relations: {
    //     profile: true,
    //     roles: true,
    //   },
    //   where: {
    //     username,
    //     profile: {
    //       gender,
    //     },
    //     roles: {
    //       id: role,
    //     },
    //   },
    //   take,
    //   skip,
    // });
    const qb = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile')
      .innerJoinAndSelect('user.roles', 'roles');

    const obj = {
      'profile.gender': gender,
      'roles.id': role,
    };

    const newQuery = conditionUtils<User>(qb, obj);
    return newQuery.take(take).skip(skip).getMany();
  }

  find(username: string) {
    return this.userRepository.findOne({ where: { username } });
  }

  findOne(id: number) {
    return this.userRepository.findOne({ where: { id } });
  }

  async create(user: User) {
    if (user.roles instanceof Array && typeof user.roles[0] === 'number') {
      // 查询所有的用户角色
      user.roles = await this.rolesRepository.find({
        where: {
          id: In(user.roles),
        },
      });
    }
    const userTmp = await this.userRepository.create(user);
    return this.userRepository.save(userTmp);
  }

  async update(id: number, user: Partial<User>) {
    const userTemp = await this.findProfile(id);
    const newUser = this.userRepository.merge(userTemp, user);
    // 联合模型更新，需要使用save方法或者queryBuilder
    return this.userRepository.save(newUser);
    // 下面的update方法，只适合单模型的更新，不适合有关系的模型更新
    // return this.userRepository.update(id, user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    // return this.userRepository.delete(id);
    return this.userRepository.remove(user);
  }
  getUsers() {
    return {
      code: 0,
      data: [],
      msg: 'success',
    };
  }

  getRange(num) {
    return {
      code: 0,
      data: Array.from({ length: num }, (v, k) => k + 1),
      msg: 'success',
    };
  }

  findProfile(id: number) {
    return this.userRepository.findOne({
      where: {
        id,
      },
      relations: {
        profile: true,
      },
    });
  }

  async findLogs(id: number) {
    // const user = await this.findOne(id);
    // return this.logsRepository.find({
    //   where: {
    //     user,
    //   },
    //   relations: {
    //     user: true,
    //   },
    // });
  }

  findLogsByGroup(id: number) {
    // // SELECT logs.result as result, COUNT(logs.result) as count from logs, user WHERE user.id = logs.userId AND user.id = 2 GROUP BY logs.result;
    // // return this.logsRepository
    // //   .createQueryBuilder('logs')
    // //   .select('logs.result', 'result')
    // //   .addSelect('COUNT("logs.result")', 'count')
    // //   .leftJoinAndSelect('logs.user', 'user')
    // //   .where('user.id = :id', { id })
    // //   .groupBy('logs.result')
    // //   .orderBy('result', 'DESC')
    // //   .addOrderBy('count', 'DESC')
    // //   .offset(2) //分页
    // //   .limit(3) //分页
    // //   .getRawMany();
    // // 使用原生SQL
    // return this.logsRepository.query('SELECT * FROM logs');
    return [];
  }
}
