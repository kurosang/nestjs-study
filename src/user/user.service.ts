import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Logs } from '../logs/logs.entity';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Logs) private readonly logsRepository: Repository<Logs>,
  ) {}

  findAll() {
    return this.userRepository.find();
  }

  find(username: string) {
    return this.userRepository.findOne({ where: { username } });
  }

  findOne(id: number) {
    return this.userRepository.findOne({ where: { id } });
  }

  async create(user: User) {
    const userTmp = await this.userRepository.create(user);
    return this.userRepository.save(userTmp);
  }

  async update(id: number, user: Partial<User>) {
    return this.userRepository.update(id, user);
  }

  remove(id: number) {
    return this.userRepository.delete(id);
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
    const user = await this.findOne(id);
    return this.logsRepository.find({
      where: {
        user,
      },
      relations: {
        user: true,
      },
    });
  }

  findLogsByGroup(id: number) {
    // SELECT logs.result as result, COUNT(logs.result) as count from logs, user WHERE user.id = logs.userId AND user.id = 2 GROUP BY logs.result;
    // return this.logsRepository
    //   .createQueryBuilder('logs')
    //   .select('logs.result', 'result')
    //   .addSelect('COUNT("logs.result")', 'count')
    //   .leftJoinAndSelect('logs.user', 'user')
    //   .where('user.id = :id', { id })
    //   .groupBy('logs.result')
    //   .orderBy('result', 'DESC')
    //   .addOrderBy('count', 'DESC')
    //   .offset(2) //分页
    //   .limit(3) //分页
    //   .getRawMany();

    // 使用原生SQL
    return this.logsRepository.query('SELECT * FROM logs');
  }
}
