import { Module } from '@nestjs/common';
import { ApiKeyMiddleware } from './apiKey.middleware';
import { ApiKeysModule } from 'src/api-keys/api-keys.module';
import { CacheInterceptor } from './cache.interceptor';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  controllers: [],
  providers: [
    ApiKeyMiddleware,
    CacheInterceptor
  ],
  imports: [
    ApiKeysModule,
    CacheModule.register({
      ttl: 10 * 1000,
      max: 100,
    }),
  ],
  exports: [
    ApiKeyMiddleware,
    CacheInterceptor
  ]
})
export class MiddlewareModule {}
