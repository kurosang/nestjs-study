import { User } from './src/user/user.entity';
import { Profile } from './src/user/profile.entity';
// import { Logs } from './logs/logs.entity';
import { Roles } from './src/roles/roles.entity';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';

export const connectionParams = {
  type: 'mysql',
  host: '127.0.0.1',
  port: 3306,
  username: 'root',
  password: 'example',
  entities: [User, Profile, Roles],
  database: 'testdb',
  synchronize: true,
  logging: false,
} as TypeOrmModuleOptions;

export default new DataSource({
  ...connectionParams,
  migrations: ['src/migrations/**'],
  subscribers: [],
} as DataSourceOptions);
