import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { ApiPermissions } from 'src/types/permissions';
import { User } from 'src/users/schema/users.schema';


@Schema({
  timestamps: true,
})
export class ApiKey extends mongoose.Document {
  @Prop({ required: true })
  key: string;

  @Prop({ required: true })
  permissions: ApiPermissions[];

  @Prop({ required: true })
  lockedDomains: string[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: mongoose.Schema.Types.ObjectId;

  @Prop()
  bucketIds: string[];

  user?: User;
}

export const ApiKeySchema = SchemaFactory.createForClass(ApiKey);

ApiKeySchema.index({ key: 1 });

ApiKeySchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true
})

ApiKeySchema.set('toObject', { virtuals: true });
ApiKeySchema.set('toJSON', { virtuals: true });