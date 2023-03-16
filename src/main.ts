import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AllExceptionFilter } from './filters/all-exception.filter';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

async function bootstrap() {
  // createLogger of Winston

  const app = await NestFactory.create(AppModule, {
    cors: true, // 允许跨域
    // 关闭整个nestjs日志
    // logger: false
  });
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  // app.setGlobalPrefix('api/v1');

  // const httpAdapter = app.get(HttpAdapterHost);
  // const logger = new Logger();
  // app.useGlobalFilters(new AllExceptionFilter(logger, httpAdapter));

  // 全局拦截器
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 去除在类上不存在的字段
    }),
  );

  // 弊端：无法使用DI -> 无法访问userService，需要在app.module的provider引入guard
  // app.useGlobalGuards()

  // helmet头部安全
  app.use(helmet());
  // rateLimit限流
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15mins
      max: 100, // limit each IP to 100 requests per windowMs
    }),
  );

  const port = 11999;
  await app.listen(port);
  // logger.warn(`App 运行在 ${port}`);
}
bootstrap();
