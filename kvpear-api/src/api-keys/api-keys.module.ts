import { Module } from '@nestjs/common';
import { ApiKeysService } from './api-keys.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ApiKeySchema } from './schemas/apiKeys.schema';

@Module({
  controllers: [],
  providers: [ApiKeysService],
  exports: [ApiKeysService],
  imports: [
    MongooseModule.forFeature([
      { name: 'ApiKey', schema: ApiKeySchema },
  ])],
})
export class ApiKeysModule {}
