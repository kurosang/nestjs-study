import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
// import configuration from './configuration';
import * as Dotenv from 'dotenv';
import * as Joi from 'joi'; // https://joi.dev/api/?v=17.7.0

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
        // DB_PORT: Joi.number().default(3306),
        DB_PORT: Joi.number().valid(3306, 3308), // 限制数值是3306、3308
        DB_URL: Joi.string().domain(),
        DB_HOST: Joi.string().ip(), // IP类型
      }),
    }),
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
