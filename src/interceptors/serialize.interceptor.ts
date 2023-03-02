import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { map, Observable } from 'rxjs';

@Injectable()
export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // const req = context.switchToHttp().getRequest();
    // console.log('这里在拦截器执行之前', req.user);
    return next.handle().pipe(
      map((data) => {
        console.log('这里在拦截器执行之后');
        return plainToInstance(this.dto, data, {
          // 设置为true，所有经过该itc的数据都需要设置Expose或Exclude
          // Expose设置那些字段需要暴露，Exclude设置哪些字段不需要暴露
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
