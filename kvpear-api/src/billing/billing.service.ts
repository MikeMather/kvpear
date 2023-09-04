import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BillingRecord } from './schemas/billingRecord.schema';

@Injectable()
export class BillingService {
  constructor(@InjectModel ('BillingRecord') private readonly billingRecordModel: Model<BillingRecord>) {}

  async incrementUsage(userId: string) {
    const firstDayOfMonth = new Date();
    firstDayOfMonth.setDate(1);
    // find latest billing record for user
    const record = await this.billingRecordModel.findOneAndUpdate(
      { userId, periodStart: { $gte: firstDayOfMonth } },
      { $inc: { requests: 1 } },
      { new: true, upsert: true }
    ).exec();
    return record;
  }
}
