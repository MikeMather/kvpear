import { Module } from '@nestjs/common';
import { BillingService } from './billing.service';
import { BillingController } from './billing.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BillingRecordSchema } from './schemas/billingRecord.schema';

@Module({
  controllers: [BillingController],
  providers: [BillingService],
  exports: [
    BillingService
  ],
  imports: [
    MongooseModule.forFeature([
      { name: 'BillingRecord', schema: BillingRecordSchema },
    ]),
  ]
})
export class BillingModule {}
