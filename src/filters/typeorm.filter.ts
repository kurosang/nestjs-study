import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { QueryFailedError, TypeORMError } from 'typeorm';

@Catch()
export class TypeormFilter<T> implements ExceptionFilter {
  catch(exception: TypeORMError, host: ArgumentsHost) {
    // console.log(
    //   '🚀 ~ file: typeorm.filter.ts:6 ~ TypeormFilter<T> ~ exception',
    //   exception,
    // );
    const ctx = host.switchToHttp();

    // console.log('host msg:', ctx);
    let code = 500;
    if (exception instanceof QueryFailedError) {
      code = exception.driverError.errno;
    }
    // 响应 请求对象
    const response = ctx.getResponse();

    response.status(500).json({
      code,
      timestamp: new Date().toISOString(),
      // path: request.url,
      // method: request.method,
      message: exception.message,
    });
  }
}
