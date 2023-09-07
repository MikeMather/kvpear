import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schema/users.schema';

@Module({
  controllers: [],
  providers: [UsersService],
  exports: [UsersService],
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
  ])]
})
export class UsersModule {}
