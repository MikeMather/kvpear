import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class UseEntityInterceptor implements NestInterceptor {
  intercept(ctx: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(data => {
        if (Array.isArray(data)) {
          return data.map(item => item.serialize ? item.serialize() : item)
        }
        return data?.serialize ? data.serialize() : data
      }),
    )
  }
}