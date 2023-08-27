import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  @Inject(CACHE_MANAGER) cache: Cache;

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const shouldInvalidate = Reflect.getMetadata('invalidateCache', context.getHandler());
    const shouldUseCache = Reflect.getMetadata('shouldUseCache', context.getHandler());
    let cachedResponse = null;
    const { cacheKey } = request.raw;

    if (shouldUseCache) {
      if (request.method === 'GET') {
        if (!cacheKey) {
          return next.handle();
        }
        cachedResponse = await this.cache.get(cacheKey);
        
        if (cachedResponse) {
          console.log('Cache hit')
          return of(cachedResponse);
        }
      }
    }

    return next.handle().pipe(
      tap(async (response) => {
        if (request.method === 'GET' && !cachedResponse) {
          console.log('Cache miss')
          await this.cache.set(cacheKey, response);
        }

        if (shouldInvalidate) {
          console.log('Invalidating cache')
          await this.cache.del(cacheKey);
        }
        return response;
      }),
    );
  }
}
