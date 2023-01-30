import { Controller, Get, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';
import { ConfigEnum } from '../enum/config.enum';
import { User } from './user.entity';
import { Logger } from 'nestjs-pino';

@Controller('user')
export class UserController {
  // private logger = new Logger(UserController.name);

  // 实际相当于 this.userSevice = new UserService()
  constructor(
    private userService: UserService,
    private configService: ConfigService,
    private logger: Logger,
  ) {
    this.logger.log('UserController init');
  }

  @Get()
  getUsers(): any {
    // const db = this.configService.get(ConfigEnum.DB);
    // const url = this.configService.get(ConfigEnum.DB_URL);
    // 命令行 $ DB_PASS=12345 pnpm run start:dev
    // const pass =
    //   this.configService.get(ConfigEnum.DB_PASS) || process.env.DB_PASS;
    // // const data = this.configService.get('db');
    // console.log(pass);
    // return this.userService.getUsers();
    this.logger.log('request /getUsers');
    return this.userService.findAll();
  }

  @Post()
  addUser() {
    const user = { username: 'kuro', password: '123456' } as User;
    return this.userService.create(user);
  }

  @Get('range')
  getRange(@Query() query): any {
    return this.userService.getRange(query.num);
  }

  @Get('profile')
  getProfile() {
    return this.userService.findProfile(1);
  }

  @Get('logs')
  getLogs() {
    return this.userService.findLogs(1);
  }

  @Get('logsbygroup')
  async getLogsByGroup() {
    const res = await this.userService.findLogsByGroup(1);
    return res.map((o) => ({
      result: o.result,
      count: o.count,
    }));
  }
}
