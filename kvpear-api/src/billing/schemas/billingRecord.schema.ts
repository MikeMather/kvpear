import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from 'src/users/schema/users.schema';

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

  @Prop()
  recordedAt: Date;

  user?: User;
}

export const BillingRecordSchema = SchemaFactory.createForClass(BillingRecord);

BillingRecordSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true
})

BillingRecordSchema.set('toObject', { virtuals: true });
BillingRecordSchema.set('toJSON', { virtuals: true });