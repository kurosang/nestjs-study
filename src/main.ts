import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log(123);
  // app.setGlobalPrefix('api/v1');
  await app.listen(3000);
}
bootstrap();
