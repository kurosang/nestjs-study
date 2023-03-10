import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  LoggerService,
  HttpAdapterHost,
  HttpStatus,
} from '@nestjs/common';
import * as requestIp from 'request-ip';
import { QueryFailedError } from 'typeorm';

// 如果不设置参数，就是捕获所有异常，不限http
@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(
    private logger: LoggerService,
    private readonly httpAdapterHost: HttpAdapterHost,
  ) {}
  catch(exception: unknown, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    // http状态码
    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const msg = exception['response'] || 'Internal Server Error';

    // // 加入更多异常错误逻辑
    // if (exception instanceof QueryFailedError) {
    //   msg = exception.message;
    //   // if (exception.driverError.errno === 1062) {
    //   //   msg = '唯一索引冲突';
    //   // }
    // }

    const responseBody = {
      headers: request.headers,
      query: request.query,
      body: request.body,
      params: request.params,
      timestamp: new Date().toISOString(),
      // 还可以加入一些用户信息
      // IP信息
      ip: requestIp.getClientIp(request),
      exception: exception['name'],
      error: msg,
    };
    this.logger.error('[kuro]', responseBody);

    httpAdapter.reply(response, responseBody, httpStatus);
  }
}
