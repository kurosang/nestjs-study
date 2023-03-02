import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserService } from '../user/user.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private userService: UserService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1.获取请求对象
    const req = context.switchToHttp().getRequest();

    // 2. 获取请求中的用户信息进行逻辑上的判断 -> 角色判断
    const user = await this.userService.find(req.user.username);
    console.log(
      '🚀 ~ file: admin.guard.ts:14 ~ AdminGuard ~ canActivate ~ user:',
      user,
    );
    // 普通用户
    if (user.roles.filter((o) => o.id === 2).length > 0) {
      return true;
    }
    return false;
  }
}
