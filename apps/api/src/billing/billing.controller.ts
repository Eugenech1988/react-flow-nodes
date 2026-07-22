import { Controller, Post, Body, Req, Headers, BadRequestException, UseGuards, Get } from '@nestjs/common';
import { BillingService } from './billing.service';
import { Plan } from '@prisma/client';
import { Request } from 'express';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Post('checkout')
  @UseGuards(JwtAuthGuard)
  async createCheckout(
    @Req() req: Request & { user: { id: string } },
    @Body() body: { plan: Plan },
  ) {
    const userId = req.user?.id || 'temp-user-id';
    return this.billingService.createCheckoutSession(userId, body.plan);
  }

  @Get('subscription')
  @UseGuards(JwtAuthGuard)
  async getSubscription(@Req() req: Request & { user: { id: string } }) {
    return this.billingService.getSubscriptionByUserId(req.user.id);
  }

  @Post('webhook')
  async handleStripeWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() req: Request & { rawBody?: Buffer },
  ) {
    if (!signature) {
      throw new BadRequestException('Missing stripe-signature header');
    }
    const payload = req.rawBody;
    if (!payload) {
      throw new BadRequestException('Missing request raw body');
    }
    return this.billingService.handleWebhook(signature, payload);
  }

  @Get('/transactions')
  @UseGuards(JwtAuthGuard)
  async getTransactions(@Req() req: Request & { user: { id: string } }) {
    return this.billingService.getTransactionsByUserId(req.user.id);
  }

  @Post('cancel')
  @UseGuards(JwtAuthGuard)
  async cancelSubscription(@Req() req: Request & { user: { id: string } }) {
    return this.billingService.cancelSubscription(req.user.id);
  }
}