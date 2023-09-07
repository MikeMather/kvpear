import { Module } from '@nestjs/common';
import { BillingService } from './billing.service';
import { BillingController } from './billing.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BillingRecordSchema } from './schemas/billingRecord.schema';
import { BillingScheduledTasksService } from './tasks/billingScheduledTasks.service';
import { UserSchema } from 'src/users/schema/users.schema';

@Module({
  controllers: [BillingController],
  providers: [BillingService, BillingScheduledTasksService],
  exports: [
    BillingService
  ],
  imports: [
    MongooseModule.forFeature([
      { name: 'BillingRecord', schema: BillingRecordSchema },
    ]),
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
    ]),
  ]
})
export class BillingModule {}
