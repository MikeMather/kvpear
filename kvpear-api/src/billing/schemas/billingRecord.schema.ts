import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

@Schema({
  timestamps: true,
})
export class BillingRecord extends mongoose.Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  periodStart: Date;

  @Prop({ required: true, default: 0 })
  requests: number;
}

export const BillingRecordSchema = SchemaFactory.createForClass(BillingRecord);