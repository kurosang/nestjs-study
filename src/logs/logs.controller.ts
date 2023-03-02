import { Body, Controller, Get, Post, UseInterceptors } from '@nestjs/common';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { Serialize } from '../decorators/serialize.decorator';
import { SerializeInterceptor } from '../interceptors/serialize.interceptor';

class LogsDto {
  @IsString()
  @IsNotEmpty()
  msg: string;

  @IsString()
  id: string;
}

class PublicLogsDto {
  @Expose()
  msg: string;
}

@Controller('logs')
export class LogsController {
  @Get()
  getTest() {
    return 'test';
  }

  @Post()
  //   @UseInterceptors(new SerializeInterceptor(PublicLogsDto))
  @Serialize(PublicLogsDto)
  postTest(@Body() dto: LogsDto) {
    console.log(
      '🚀 ~ file: logs.controller.ts:12 ~ LogsController ~ postTest ~ dto:',
      dto,
    );

    return dto;
  }
}
