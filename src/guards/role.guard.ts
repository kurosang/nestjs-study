import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '../enum/roles.enum';
import { UserService } from '../user/user.service';

@Injectable()
export class RoleGuard implements CanActivate {
  // reflector是方便我们查看metadata的实例
  constructor(private reflector: Reflector, private userSevice: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // jwt -> userId -> user -> roles
    // getAllAndMerge -> 合并
    // getAllAndOverride -> 读取路由上的metadata
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(), // handler相当于路由
      context.getClass(), // class相当于controller
    ]);
    console.log(
      '🚀 ~ file: role.guard.ts:19 ~ RoleGuard ~ requiredRoles:',
      requiredRoles,
    );
    if (!requiredRoles) {
      return true;
    }

    const req = context.switchToHttp().getRequest();
    const user = await this.userSevice.find(req.user.username);
    console.log(
      '🚀 ~ file: role.guard.ts:31 ~ RoleGuard ~ canActivate ~ user:',
      user,
    );

    const roleIds = user.roles.map((o) => o.id);
    return requiredRoles.some((role) => roleIds.includes(role));
  }
}
