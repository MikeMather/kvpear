import { Module } from '@nestjs/common';
import { BucketsService } from './buckets.service';
import { BucketsController } from './buckets.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BucketSchema } from './schemas/buckets.schema';
import { ApiKeysModule } from 'src/api-keys/api-keys.module';
import { MiddlewareModule } from 'src/middleware/middleware.module';
import { CacheModule } from '@nestjs/cache-manager';
import { KeyValuesModule } from 'src/key-values/key-values.module';
import { KeyValuesService } from 'src/key-values/key-values.service';

@Module({
  controllers: [BucketsController],
  providers: [BucketsService],
  imports: [
    ApiKeysModule,
    KeyValuesModule,
    MongooseModule.forFeature([
      { name: 'Bucket', schema: BucketSchema },
    ]),
    MiddlewareModule,
    CacheModule.register({
      ttl: 60 * 1000,
      max: 100 * 1000,
    }),
  ],
  exports: [
    MongooseModule.forFeature([
      { name: 'Bucket', schema: BucketSchema },
    ])
  ]
})
export class BucketsModule {}
