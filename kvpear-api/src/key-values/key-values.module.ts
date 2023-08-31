import { Module } from '@nestjs/common';
import { KeyValuesService } from './key-values.service';
import { KeyValuesController } from './key-values.controller';
import { ApiKeysModule } from 'src/api-keys/api-keys.module';
import { MiddlewareModule } from 'src/middleware/middleware.module';
import { CacheModule } from '@nestjs/cache-manager';
import { MongooseModule } from '@nestjs/mongoose';
import { KeyValueSchema } from './schemas/keyValues.schema';

@Module({
  controllers: [KeyValuesController],
  providers: [KeyValuesService],
  imports: [
    ApiKeysModule,
    MiddlewareModule,
    CacheModule.register({
      ttl: 60 * 1000,
      max: 100 * 1000,
    }),
    MongooseModule.forFeature([
      { name: 'KeyValue', schema: KeyValueSchema },
    ]),
  ],
  exports: [
    KeyValuesService
  ]
})
export class KeyValuesModule {}
