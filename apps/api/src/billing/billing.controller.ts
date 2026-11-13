import {
  Controller,
  Post,
  Body,
  Req,
  Headers,
  BadRequestException,
  UseGuards,
  Get,
  Param,
  Res,
} from '@nestjs/common';
import { checkoutPlanInputSchema } from '@pipeline/contracts';
import { BillingService } from '@/billing/billing.service';
import type { Request, Response } from 'express';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

type TAuthedRequest = Request & { user: { id: string } };

@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Post('checkout')
  @UseGuards(JwtAuthGuard)
  async createCheckout(@Req() req: TAuthedRequest, @Body() body: unknown) {
    const parsed = checkoutPlanInputSchema.safeParse(body);
    if (!parsed.success) {
      const message = parsed.error.issues.map((issue) => issue.message).join(', ');
      throw new BadRequestException(message || 'Invalid checkout payload');
    }

    const userId = req.user?.id;
    if (!userId) {
      throw new BadRequestException('User is not authenticated');
    }

    return this.billingService.createCheckoutSession(
      userId,
      parsed.data.plan,
      parsed.data.cycle,
    );
  }

  @Get('subscription')
  @UseGuards(JwtAuthGuard)
  async getSubscription(@Req() req: TAuthedRequest) {
    return this.billingService.getSubscriptionByUserId(req.user.id);
  }

  @Get('portal')
  @UseGuards(JwtAuthGuard)
  async openBillingPortal(@Req() req: TAuthedRequest, @Res() res: Response) {
    const { url } = await this.billingService.createBillingPortalSession(req.user.id);
    return res.redirect(url);
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

  @Get('transactions')
  @UseGuards(JwtAuthGuard)
  async getTransactions(@Req() req: TAuthedRequest) {
    return this.billingService.getTransactionsByUserId(req.user.id);
  }

  @Get('transactions/:id/invoice')
  @UseGuards(JwtAuthGuard)
  async downloadInvoice(
    @Req() req: TAuthedRequest,
    @Param('id') transactionId: string,
    @Res() res: Response,
  ) {
    const filePath = await this.billingService.getInvoiceFilepath(
      req.user.id,
      transactionId,
    );

    return res.download(filePath, (err) => {
      if (err) {
        this.billingService['logger']?.error?.('Invoice download failed:', err);
      }
    });
  }

  @Post('cancel')
  @UseGuards(JwtAuthGuard)
  async cancelSubscription(@Req() req: TAuthedRequest) {
    return this.billingService.cancelSubscription(req.user.id);
  }
}