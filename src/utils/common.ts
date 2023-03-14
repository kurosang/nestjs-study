import { Roles } from '../decorators/roles.decorator';
import { Logs } from '../logs/logs.entity';
import { Menus } from '../menus/menus.entity';
import { User } from '../user/user.entity';

export const getEntities = (path: string) => {
  // /users -> User, /logs -> Logs, /roles -> Roles, /menus -> Menus, /auth -> 'Auth'
  const map = {
    '/users': User,
    '/logs': Logs,
    '/roles': Roles,
    '/menus': Menus,
    '/auth': 'auth',
  };
  Object.keys(map).forEach((k) => {
    if (path.startsWith(k)) {
      return map[k];
    }
  });
};
