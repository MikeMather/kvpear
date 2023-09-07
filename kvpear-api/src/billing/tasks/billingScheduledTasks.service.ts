import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { BillingRecord } from '../schemas/billingRecord.schema';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/users/schema/users.schema';
import Stripe from 'stripe';
import { randomUUID } from 'crypto';

@Injectable()
export class BillingScheduledTasksService {

  constructor(
    @InjectModel ('BillingRecord') private readonly billingRecordModel: Model<BillingRecord>,
    @InjectModel ('User') private readonly userModel: Model<User>
  ) {}

  // Gets the most recent billing record for each user and reports to stripe
  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  async handleCron() {
    const currentDate = new Date();
    const currentMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const previousMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);

    console.log(currentMonthStart);
    console.log(previousMonthStart);

    // most recent billing records for each userId
    const billingRecords = await this.billingRecordModel.find({
      periodStart: {
        $gte: previousMonthStart,
        $lt: currentMonthStart 
      },
      recordedAt: null
    }).populate('user').exec();
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
      apiVersion: '2023-08-16'
    });
    for (const record of billingRecords) {
      const idempotencyKey = randomUUID();
      
      try {
        const subscription = await stripe.subscriptions.retrieve(record.user.subscriptionId);
        const subscriptionItemId = subscription.items.data[0].id;
        const response = await stripe.subscriptionItems.createUsageRecord(subscriptionItemId,
          {
            quantity: record.requests,
            action: 'set'
          }, {
            idempotencyKey
          }
        );
        console.log(response);
        await this.billingRecordModel.updateOne({ _id: record._id }, { recordedAt: new Date() }).exec();
      } catch (error) {
        console.log(error);
      }
    }
  }
}
