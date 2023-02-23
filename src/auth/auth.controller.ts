import {
  Body,
  Controller,
  HttpException,
  Post,
  UseFilters,
} from '@nestjs/common';
import { TypeormFilter } from '../filters/typeorm.filter';
import { AuthService } from './auth.service';

export function TypeOrmDecorator() {
  return UseFilters(new TypeormFilter());
}

@Controller('auth')
@TypeOrmDecorator()
export class AuthController {
  constructor(private authSevice: AuthService) {}
  @Post('/signin')
  signin(@Body() dto: any) {
    const { username, password } = dto;
    return this.authSevice.signin(username, password);
  }

  @Post('/signup')
  signup(@Body() dto: any) {
    const { username, password } = dto;
    console.log(username, password);
    if (!username || !password) {
      throw new HttpException('用户名或密码不能为空', 400);
    }
    // 正则
    if (
      (typeof username === 'string' && username.length <= 6) ||
      (typeof password === 'string' && username.length <= 6)
    ) {
      throw new HttpException('账号秘密要超过6位', 400);
    }
    return this.authSevice.signup(username, password);
  }
}
