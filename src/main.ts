import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

async function bootstrap() {
  // createLogger of Winston

  const app = await NestFactory.create(AppModule, {
    // 关闭整个nestjs日志
    // logger: false
  });
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  // app.setGlobalPrefix('api/v1');
  const port = 3000;
  await app.listen(port);
  // logger.warn(`App 运行在 ${port}`);
}
bootstrap();
