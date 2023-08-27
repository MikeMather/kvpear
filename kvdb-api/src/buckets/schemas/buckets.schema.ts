import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { BucketEntity } from '../entities/Bucket.entity';
import { Serializable } from 'src/utils/entities';
import { KeyValuePair } from 'src/types/models';

@Schema({
  timestamps: true,
})
export class Bucket extends mongoose.Document {
  @Prop({ required: true })
  name: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: mongoose.Schema.Types.ObjectId;

  @Prop({ type: [{ key: String, value: mongoose.Schema.Types.Mixed }] })
  keyValuePairs: KeyValuePair[];

  serialize: () => any;
}

export const BucketSchema = Serializable(BucketEntity)(SchemaFactory.createForClass(Bucket));

BucketSchema.index({ userId: 1, name: 1 }, { unique: true }); // Compound index
