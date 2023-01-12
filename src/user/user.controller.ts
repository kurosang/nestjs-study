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
    const db = this.configService.get(ConfigEnum.DB);
    console.log(db);
    return this.userService.getUsers();
  }

  @Get('range')
  getRange(@Query() query): any {
    return this.userService.getRange(query.num);
  }
}
