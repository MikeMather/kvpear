import { Module } from '@nestjs/common';
import { ApiKeysService } from './api-keys.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ApiKeySchema } from './schemas/apiKeys.schema';
import { UserSchema } from 'src/users/schema/users.schema';

@Module({
  controllers: [],
  providers: [ApiKeysService],
  exports: [ApiKeysService],
  imports: [
    MongooseModule.forFeature([
      { name: 'ApiKey', schema: ApiKeySchema },
      { name: 'User', schema: UserSchema }
  ]),],
})
export class ApiKeysModule {}
