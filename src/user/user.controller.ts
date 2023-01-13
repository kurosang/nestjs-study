import { Controller, Get, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';
import { ConfigEnum } from '../enum/config.enum';

@Controller('user')
export class UserController {
  // 实际相当于 this.userSevice = new UserService()
  constructor(
    private userService: UserService,
    private configService: ConfigService,
  ) {}

  @Get()
  getUsers(): any {
    // const db = this.configService.get(ConfigEnum.DB);
    // const url = this.configService.get(ConfigEnum.DB_URL);
    // 命令行 $ DB_PASS=12345 pnpm run start:dev
    // const pass =
    //   this.configService.get(ConfigEnum.DB_PASS) || process.env.DB_PASS;
    // // const data = this.configService.get('db');
    // console.log(pass);
    return this.userService.getUsers();
  }

  @Get('range')
  getRange(@Query() query): any {
    return this.userService.getRange(query.num);
  }
}
