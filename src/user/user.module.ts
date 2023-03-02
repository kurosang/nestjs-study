import { Module, Logger, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { Logs } from '../logs/logs.entity';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { UserService } from './user.service';
import { LoggerModule } from 'nestjs-pino';
import path = require('path');
import { Roles } from '../roles/roles.entity';
// 让其他模块不import也可以使用
@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([User, Roles]),
    // LoggerModule.forRoot({
    //   pinoHttp: {
    //     transport:
    //       process.env.NODE_ENV === 'prod'
    //         ? {
    //             target: 'pino-pretty',
    //             options: {
    //               colorize: true,
    //             },
    //           }
    //         : {
    //             target: 'pino-roll',
    //             options: {
    //               file: path.join('logs', 'log.txt'),
    //               frequency: 'daily', // 频率
    //               size: '0.1k', // 一般10M
    //               mkdir: true,
    //             },
    //           },
    //   },
    // }),
  ],
  exports: [UserService],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
