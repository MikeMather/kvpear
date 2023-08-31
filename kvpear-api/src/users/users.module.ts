import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/users.schema';
import { ApiKeysModule } from 'src/api-keys/api-keys.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    ApiKeysModule,
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema }
  ])
  ]
})
export class UsersModule {}
