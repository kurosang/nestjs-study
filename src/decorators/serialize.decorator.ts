import { UseInterceptors } from '@nestjs/common';
import { SerializeInterceptor } from '../interceptors/serialize.interceptor';

interface ClassConstrutor {
  new (...args: any[]): any;
}

export function Serialize(dto: ClassConstrutor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}
