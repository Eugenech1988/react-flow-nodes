import { Module } from '@nestjs/common';
import { BillingService } from '@/billing/billing.service';
import { BillingController } from '@/billing/billing.controller';

@Module({
  controllers: [BillingController],
  providers: [BillingService],
})
export class BillingModule {}
