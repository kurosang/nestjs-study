import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { getUserDto } from '../user/dto/get-user.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(private userSerive: UserService, private jwt: JwtService) {}
  async signin(username: string, password: string) {
    console.log(111);
    // const res = await this.userSerive.findAll({ username } as getUserDto);
    const user = await this.userSerive.find(username);

    if (user && user.password === password) {
      // 生成token
      return await this.jwt.signAsync(
        {
          username: user.username,
          sub: user.id,
        },
        // { expiresIn: '1d' }, 局部设置 -> refreshToken
      );
    }

    throw new UnauthorizedException(); // sign -> service -> jwtService
  }
  async signup(username: string, password: string) {
    const res = await this.userSerive.create({
      username,
      password,
    });
    return res;
  }
}
