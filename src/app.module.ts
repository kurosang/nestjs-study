import { Global, Logger, Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import * as Dotenv from 'dotenv';
import * as Joi from 'joi'; // https://joi.dev/api/?v=17.7.0
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogServiceModule } from './log-service/log-service.module';
import { connectionParams } from '../ormconfig';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AdminGuard } from './guards/admin.guard';
import { LogsModule } from './logs/logs.module';

const envFilePath = `.env.${process.env.NODE_ENV || 'dev'}`;

// global - 相当于把app.module进行一个全局注册
@Global()
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
        DB_HOST: Joi.alternatives().try(
          Joi.string().ip(),
          Joi.string().domain(),
        ), // IP类型
        DB_TYPE: Joi.string().valid('mysql'),
        DB_DATABASE: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_SYNC: Joi.string().default(false),
        LOG_ON: Joi.boolean(),
        LOG_LEVEL: Joi.string(),
      }),
    }),
    TypeOrmModule.forRoot(connectionParams),
    UserModule,
    LogsModule,
    LogServiceModule,
    AuthModule,
  ],
  controllers: [],
  providers: [
    Logger,
    // {
    //   provide: APP_GUARD,
    //   useClass: AdminGuard,
    // },
  ],
  exports: [Logger],
})
export class AppModule {}
