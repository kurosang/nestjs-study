import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  getUsers() {
    return {
      code: 0,
      data: [],
      msg: 'success',
    };
  }

  getRange(num) {
    return {
      code: 0,
      data: Array.from({ length: num }, (v, k) => k + 1),
      msg: 'success',
    };
  }
}
