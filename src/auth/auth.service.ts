import { Injectable } from '@nestjs/common';
import { getUserDto } from '../user/dto/get-user.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(private userSerive: UserService) {}
  signin(username: string, password: string) {
    const res = this.userSerive.findAll({ username } as getUserDto);
    return res;
  }
  signup(username: string, password: string) {
    return 'service signup' + username + password;
  }
}
