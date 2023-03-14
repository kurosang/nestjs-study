import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { CaslAbilityService } from '../auth/casl-ability.service';
import {
  CaslHandlerType,
  CHECK_POLICIES_KEY,
  PolicyHandlerCallback,
} from '../decorators/casl.decorator';

@Injectable()
export class CaslGuard implements CanActivate {
  // reflector是方便我们查看metadata的实例
  constructor(
    private reflector: Reflector,
    private caslAbilityService: CaslAbilityService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // jwt -> userId -> user -> roles
    // getAllAndMerge -> 合并
    // getAllAndOverride -> 读取路由上的metadata
    const handlers = this.reflector.getAllAndOverride<PolicyHandlerCallback[]>(
      CHECK_POLICIES_KEY.HANDLER,
      [
        context.getHandler(), // handler相当于路由
        context.getClass(), // class相当于controller
      ],
    ) as CaslHandlerType;

    const canhandlers = this.reflector.getAllAndOverride<
      PolicyHandlerCallback[]
    >(CHECK_POLICIES_KEY.CAN, [
      context.getHandler(), // handler相当于路由
      context.getClass(), // class相当于controller
    ]) as CaslHandlerType;

    const cannothandlers = this.reflector.getAllAndOverride<
      PolicyHandlerCallback[]
    >(CHECK_POLICIES_KEY.CANNOT, [
      context.getHandler(), // handler相当于路由
      context.getClass(), // class相当于controller
    ]) as CaslHandlerType;

    // 判断，如果用户未设置上述的任何一个，那么就直接返回true
    if (!handlers || !canhandlers || !cannothandlers) {
      return true;
    }

    const req = context.switchToHttp().getRequest();
    if (req.user) {
      const ability = await this.caslAbilityService.forRoot(req.user.username);
      let flag = true;
      if (handlers) {
        if (handlers instanceof Array) {
          flag = flag && handlers.every((handler) => handler(ability));
        } else if (typeof handlers === 'function') {
          flag = flag && handlers(ability);
        }
      }
      if (canhandlers) {
        if (canhandlers instanceof Array) {
          flag = flag && canhandlers.every((handler) => handler(ability));
        } else if (typeof canhandlers === 'function') {
          flag = flag && canhandlers(ability);
        }
      }
      if (cannothandlers) {
        if (cannothandlers instanceof Array) {
          flag = flag && cannothandlers.every((handler) => handler(ability));
        } else if (typeof cannothandlers === 'function') {
          flag = flag && cannothandlers(ability);
        }
      }

      return flag;
    } else {
      return false;
    }
  }
}
