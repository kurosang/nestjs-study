import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  LoggerService,
} from '@nestjs/common';

// 如果不设置参数，就是捕获所有异常，不限http
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private logger: LoggerService) {}
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    // console.log('host msg:', ctx);
    // 响应 请求对象
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    // http状态码
    const status = exception.getStatus();

    this.logger.error(exception.message, exception.stack);

    response.status(status).json({
      code: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: exception.message || exception.name,
    });
    // throw new Error('Method not implemented.');
  }
}
