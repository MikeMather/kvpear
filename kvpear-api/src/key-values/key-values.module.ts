import { Module } from '@nestjs/common';
import { KeyValuesService } from './key-values.service';
import { KeyValuesController } from './key-values.controller';
import { ApiKeysModule } from 'src/api-keys/api-keys.module';
import { BucketsModule } from 'src/buckets/buckets.module';
import { MiddlewareModule } from 'src/middleware/middleware.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  controllers: [KeyValuesController],
  providers: [KeyValuesService],
  imports: [
    BucketsModule,
    ApiKeysModule,
    MiddlewareModule,
    CacheModule.register({
      ttl: 60 * 1000,
      max: 100 * 1000,
    }),
  ]
})
export class KeyValuesModule {}
