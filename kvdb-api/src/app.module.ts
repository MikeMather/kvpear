import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { BucketsModule } from './buckets/buckets.module';
import { KeyValuesModule } from './key-values/key-values.module';
import { ApiKeysModule } from './api-keys/api-keys.module';
import { ApiKeyMiddleware } from './middleware/apiKey.middleware';
import { MiddlewareModule } from './middleware/middleware.module';

@Module({
  imports: [
    ApiKeysModule, UsersModule, BucketsModule, KeyValuesModule, MiddlewareModule,
    MongooseModule.forRoot('mongodb+srv://doadmin:3419P7QCnpH85B0s@kvdb-55111d7a.mongo.ondigitalocean.com/admin?authSource=admin&tls=true')
  ],
  controllers: [],
  providers: []
})
export class AppModule implements NestModule {

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ApiKeyMiddleware).forRoutes('*')
  }
}
