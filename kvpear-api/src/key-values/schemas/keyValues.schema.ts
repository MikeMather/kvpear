import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

@Schema({
  timestamps: true,
})
export class KeyValue extends mongoose.Document {
  @Prop({ required: true })
  key: string;

  @Prop({ required: true })
  value: mongoose.Schema.Types.Mixed;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Bucket', required: true })
  bucketId: mongoose.Schema.Types.ObjectId;
}

export const KeyValueSchema = SchemaFactory.createForClass(KeyValue);

KeyValueSchema.index({ key: 1, userId: 1, bucketId: 1 }, { unique: true });