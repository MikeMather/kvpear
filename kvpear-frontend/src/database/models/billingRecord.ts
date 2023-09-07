import { ApiPermissions } from '@/utils/types';
import { Document, Model, Schema, model, models } from 'mongoose';

export interface BillingRecordType {
  userId: string;
  periodStart: Date;
  requests: number;
}

const BillingRecordSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  periodStart: {
    type: Date,
    required: true,
  },
  requests: {
    type: Number,
    required: true,
    default: 0,
  }
}, { timestamps: true });

const BillingRecord: Model<BillingRecordDocument> = models.BillingRecord || model('BillingRecord', BillingRecordSchema);

export interface BillingRecordDocument extends BillingRecordType, Document {}

export default BillingRecord;