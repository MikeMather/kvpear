import { ConfigurableModuleBuilder, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BucketsModule } from './buckets/buckets.module';
import { KeyValuesModule } from './key-values/key-values.module';
import { ApiKeysModule } from './api-keys/api-keys.module';
import { ApiKeyMiddleware } from './middleware/apiKey.middleware';
import { MiddlewareModule } from './middleware/middleware.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BillingModule } from './billing/billing.module';
import { UsageMiddleware } from './middleware/usage.middleware';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ApiKeysModule, BucketsModule, KeyValuesModule, MiddlewareModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('DATABASE_URI'), // Loaded from .ENV
      })
    }),
    ThrottlerModule.forRoot({ // 10 requests per second
      ttl: 60,
      limit: 10,
    }),
    BillingModule,
    UsersModule
  ],
  controllers: [],
  providers: [{
    provide: APP_GUARD,
    useClass: ThrottlerGuard
  }]
})
export class AppModule implements NestModule {

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ApiKeyMiddleware).forRoutes('*');
    consumer.apply(UsageMiddleware).forRoutes('*');
  }
}
