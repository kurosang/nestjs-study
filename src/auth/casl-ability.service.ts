import { Injectable } from '@nestjs/common';
import { AbilityBuilder, createMongoAbility } from '@casl/ability';
import { Action } from '../enum/action.enum';
import { Logs } from '../logs/logs.entity';
import { UserService } from '../user/user.service';
import { getEntities } from '../utils/common';

@Injectable()
export class CaslAbilityService {
  constructor(private userService: UserService) {}
  async forRoot(username: string) {
    // 针对于全局、整个系统
    const { can, cannot, build } = new AbilityBuilder(createMongoAbility);

    // menu 名称、路径、acl -> actions -> 名称、路径 ->实体对应
    // path -> prefix -> 写死在项目代码里面

    // 其他思路： acl -> 表来进行存储 -> LogController + Action
    // log -> sys:log -> sys:log:read, sys:log:write...
    const user = await this.userService.find(username);
    // user -> 1:n roles -> 1:n menus -> 去重 {}
    user.roles.forEach((o) => {
      o.menus.forEach((menu) => {
        // path -> acl ->actions
        const actions = menu.acl.split(',');
        // todo 去重
        for (let i = 0; i < actions.length; i++) {
          const action = actions[i];
          can(action, getEntities(menu.path));
        }
      });
    });
    // can(Action.Read, Logs);
    // cannot(Action.Update, Logs);

    const ability = build({
      detectSubjectType: (object) => object.constructor,
    });

    // ability.can / cannot

    return ability;
  }
}
