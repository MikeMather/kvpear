import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { ApiPermissions } from 'src/types/permissions';

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
}

export const ApiKeySchema = SchemaFactory.createForClass(ApiKey);