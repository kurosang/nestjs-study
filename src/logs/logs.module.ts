import { Module, Global } from '@nestjs/common';

import { LogsController } from './logs.controller';

@Module({
  imports: [],
  exports: [],
  controllers: [LogsController],
  providers: [],
})
export class LogsModule {}
