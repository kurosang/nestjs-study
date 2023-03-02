import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpException,
  Post,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { TypeormFilter } from '../filters/typeorm.filter';
import { SerializeInterceptor } from '../interceptors/serialize.interceptor';
import { AuthService } from './auth.service';
import { SigninUserDto } from './dto/signin-user.dto';

export function TypeOrmDecorator() {
  return UseFilters(new TypeormFilter());
}

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
// @TypeOrmDecorator()
export class AuthController {
  constructor(private authSevice: AuthService) {}
  @Post('/signin')
  async signin(@Body() dto: SigninUserDto) {
    const { username, password } = dto;
    const token = await this.authSevice.signin(username, password);
    return {
      access_token: token,
    };
  }

  @Post('/signup')
  signup(@Body() dto: SigninUserDto) {
    const { username, password } = dto;
    console.log(username, password);
    // if (!username || !password) {
    //   throw new HttpException('用户名或密码不能为空', 400);
    // }
    // // 正则
    // if (
    //   (typeof username === 'string' && username.length <= 6) ||
    //   (typeof password === 'string' && username.length <= 6)
    // ) {
    //   throw new HttpException('账号秘密要超过6位', 400);
    // }
    return this.authSevice.signup(username, password);
  }
}
