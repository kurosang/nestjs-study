import { Module, Logger } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { Logs } from '../logs/logs.entity';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { UserService } from './user.service';
import { LoggerModule } from 'nestjs-pino';
import path = require('path');
import { Roles } from '../roles/roles.entity';
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
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
