import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { getUserDto } from '../user/dto/get-user.dto';
import { UserService } from '../user/user.service';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(private userSerive: UserService, private jwt: JwtService) {}
  async signin(username: string, password: string) {
    console.log(111);
    // const res = await this.userSerive.findAll({ username } as getUserDto);
    const user = await this.userSerive.find(username);

    if (!user) {
      throw new ForbiddenException('用户不存在');
    }
    // 比对用户名密码
    const isPassword = await argon2.verify(user.password, password);

    if (!isPassword) {
      throw new ForbiddenException('密码错误');
    }

    return await this.jwt.signAsync(
      {
        username: user.username,
        sub: user.id,
      },
      // { expiresIn: '1d' }, 局部设置 -> refreshToken
    );

    throw new UnauthorizedException(); // sign -> service -> jwtService
  }
  async signup(username: string, password: string) {
    const user = await this.userSerive.find(username);
    if (user) {
      throw new ForbiddenException('用户已存在');
    }
    const res = await this.userSerive.create({
      username,
      password,
    });
    return res;
  }
}
