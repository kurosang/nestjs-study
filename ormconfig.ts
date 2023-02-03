import { User } from './src/user/user.entity';
import { Profile } from './src/user/profile.entity';
// import { Logs } from './logs/logs.entity';
import { Roles } from './src/roles/roles.entity';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
import { ConfigEnum } from './src/enum/config.enum';

// 通过环境变量读取不同的.env文件
function getEnv(env: string): Record<string, unknown> {
  if (fs.existsSync(env)) {
    return dotenv.parse(fs.readFileSync(env));
  }
  return {};
}
// 通过dotENV来解析不同的配置
function buildConnectionOptions() {
  const defaultConfig = getEnv('.env');
  const envConfig = getEnv(`.env.${process.env.NODE_ENV || 'dev'}`);
  const config = { ...defaultConfig, ...envConfig };

  const entitiesDir =
    process.env.NODE_ENV === 'test'
      ? [__dirname + '/**/*.entity.ts']
      : [__dirname + '/**/*.entity{.js,.ts}'];

  return {
    type: config[ConfigEnum.DB_TYPE],
    host: config[ConfigEnum.DB_HOST],
    port: config[ConfigEnum.DB_PORT],
    username: config[ConfigEnum.DB_USERNAME],
    password: config[ConfigEnum.DB_PASSWORD],
    entities: entitiesDir,
    database: config[ConfigEnum.DB_DATABASE],
    synchronize: true,
    logging: false,
  } as TypeOrmModuleOptions;
}

export const connectionParams = buildConnectionOptions();
export default new DataSource({
  ...connectionParams,
  migrations: ['src/migrations/**'],
  subscribers: [],
} as DataSourceOptions);
