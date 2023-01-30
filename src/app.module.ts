import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './configuration';
import * as Dotenv from 'dotenv';
import * as Joi from 'joi'; // https://joi.dev/api/?v=17.7.0
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigEnum } from './enum/config.enum';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { User } from './user/user.entity';
import { Profile } from './user/profile.entity';
// import { Logs } from './logs/logs.entity';
import { Roles } from './roles/roles.entity';
import { join } from 'path';
import { LoggerModule } from 'nestjs-pino';

const envFilePath = `.env.${process.env.NODE_ENV || 'dev'}`;
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 如果设置了，就可以全局使用，如果不开启，就需要在子模块中手动imports ConfigModule.forRoot()
      // load: [() => configuration()],
      envFilePath,
      load: [() => Dotenv.config({ path: '.env' })],
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('prod', 'dev').default('dev'),
        DB_PORT: Joi.number().valid(3306), // 限制数值是3306
        DB_HOST: Joi.string().ip(), // IP类型
        DB_TYPE: Joi.string().valid('mysql'),
        DB_DATABASE: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_SYNC: Joi.string().default(false),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const _ = {
          type: configService.get(ConfigEnum.DB_TYPE),
          host: configService.get(ConfigEnum.DB_HOST),
          port: configService.get(ConfigEnum.DB_PORT),
          username: configService.get(ConfigEnum.DB_USERNAME),
          password: configService.get(ConfigEnum.DB_PASSWORD),
          entities: [User, Profile, Roles],
          database: configService.get(ConfigEnum.DB_DATABASE),
          // 同步本地的schema与数据库 -> 初始化的时候去使用
          synchronize: configService.get(ConfigEnum.DB_SYNC),
          // logging: ['error'],
          // 开发时可以改为true，就可以将查询的语句打印出来
          // logging: process.env.NODE_ENV === 'dev',
          logging: false,
        };

        return _ as TypeOrmModuleOptions;
      },
    }),
    // MongooseModule.forRootAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: (configService: ConfigService) => {
    //     const host = configService.get(ConfigEnum.MONGO_HOST);
    //     const port = configService.get(ConfigEnum.MONGO_PORT);
    //     const username = configService.get(ConfigEnum.MONGO_INITDB_USERNAME);
    //     const password = configService.get(ConfigEnum.MONGO_INITDB_PASSWORD);
    //     const database = configService.get(ConfigEnum.MONGO_INITDB_DATABASE);

    //     const uri = `mongodb://${host}:${port}/${database}`;
    //     return {
    //       user: username,
    //       pass: password,
    //       uri,
    //       retryAttempts: Infinity,
    //       retryDelay: 5000,
    //     } as MongooseModuleOptions;
    //   },
    // }),
    // TypeOrmModule.forRoot({
    //   type: 'mysql',
    //   host: 'localhost',
    //   port: 3306,
    //   username: 'root',
    //   password: 'example',
    //   database: 'testdb',
    //   entities: [],
    //   synchronize: true, // 同步本地的schema与数据库 -> 初始化的时候去使用
    //   logging: ['error'],
    // }),
    UserModule,
    LoggerModule.forRoot({
      pinoHttp: {
        transport:
          process.env.NODE_ENV === 'dev'
            ? {
                target: 'pino-pretty',
                options: {
                  colorize: true,
                },
              }
            : {
                target: 'pino-roll',
                options: {
                  file: join('logs', 'log.txt'),
                  frequency: 'daily', // 频率
                  size: '0.1k', // 一般10M
                  mkdir: true,
                },
              },
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
