import {
  Controller,
  Get,
  Inject,
  LoggerService,
  Logger,
  Post,
  Query,
  HttpException,
  HttpStatus,
  NotFoundException,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseFilters,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';
import { ConfigEnum } from '../enum/config.enum';
import { User } from './user.entity';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { getUserDto } from './dto/get-user.dto';
import { TypeormFilter } from '../filters/typeorm.filter';

// import { Logger } from 'nestjs-pino';

@Controller('user')
// @UseFilters(new TypeormFilter())
export class UserController {
  // private logger = new Logger(UserController.name);

  // 实际相当于 this.userSevice = new UserService()
  constructor(
    private userService: UserService,
    private configService: ConfigService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {
    this.logger.log('UserController init');
  }

  @Get()
  getUsers(@Query() query: getUserDto): any {
    console.log(
      '🚀 ~ file: user.controller.ts:50 ~ UserController ~ getUsers ~ query',
      query,
    );
    return this.userService.findAll(query);
  }

  @Post()
  addUser(@Body() dto: any, @Req() req: any) {
    console.log(
      '🚀 ~ file: user.controller.ts:62 ~ UserController ~ addUser ~ req',
      req,
    );
    const user = dto as User;
    return this.userService.create(user);
  }

  @Get('profile')
  getProfile(@Query() query) {
    console.log(
      '🚀 ~ file: user.controller.ts:88 ~ UserController ~ getProfile ~ query',
      query,
    );
    return this.userService.findProfile(1);
  }

  @Patch('/:id')
  updateUser(
    @Body() dto: any,
    @Param('id') id: number,
    @Headers('Authorization') header: any,
  ) {
    console.log(
      '🚀 ~ file: user.controller.ts:79 ~ UserController ~ header',
      header,
    );

    // 权限1: 判断用户是否是自己
    // 权限2： 判断用户是否有更新user的权限
    // 返回数据：不能包含敏感的password等信息
    if (id === header) {
      const user = dto as User;
      return this.userService.update(id, user);
    } else {
      throw new UnauthorizedException('权限不够');
    }
  }

  @Delete('/:id')
  RemoveUser(@Param('id') id: number) {
    return this.userService.remove(id);
  }

  @Get('range')
  getRange(@Query() query): any {
    return this.userService.getRange(query.num);
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

  @Get('/:id')
  getUser(): any {
    return 'hello world';
  }
}
