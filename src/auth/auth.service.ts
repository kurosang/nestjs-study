import { Injectable } from '@nestjs/common';
import { getUserDto } from '../user/dto/get-user.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(private userSerive: UserService) {}
  async signin(username: string, password: string) {
    console.log(111);
    const res = await this.userSerive.findAll({ username } as getUserDto);
    return res;
  }
  async signup(username: string, password: string) {
    const res = await this.userSerive.create({
      username,
      password,
    });
    return res;
  }
}
