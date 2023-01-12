import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import * as config from 'config';

console.log(config.get('database'));
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 如果设置了，就可以全局使用，如果不开启，就需要在子模块中手动imports ConfigModule.forRoot()
    }),
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
