import {
  Injectable,
  BadRequestException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Plan } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';
import type { TBillingCycle } from '@pipeline/contracts';
import Stripe from 'stripe';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class BillingService {
  private readonly logger = new Logger(BillingService.name);
  private stripe: Stripe;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    this.stripe = new Stripe(this.configService.get<string>('STRIPE_SECRET_KEY')!, {
      apiVersion: '2023-10-16' as Stripe.LatestApiVersion,
    });
  }

  private getPriceId(plan: Plan, cycle: TBillingCycle = 'monthly'): string {
    if (plan === Plan.FREE) {
      throw new BadRequestException('Free plan does not require a checkout session');
    }

    const envKey =
      plan === Plan.PRO
        ? cycle === 'yearly'
          ? 'STRIPE_PRO_PRICE_ID_YEARLY'
          : 'STRIPE_PRO_PRICE_ID_MONTHLY'
        : 'STRIPE_ENTERPRISE_PRICE_ID';

    const priceId = this.configService.get<string>(envKey);
    if (!priceId) {
      throw new BadRequestException(
        `Price ID for plan ${plan} (${cycle}) is not configured (${envKey})`,
      );
    }

    return priceId;
  }

  async getSubscriptionByUserId(userId: string) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { userId },
    });

    if (!subscription) {
      return {
        plan: Plan.FREE,
        planStatus: 'ACTIVE',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(),
        cancelAtPeriodEnd: false,
      };
    }

    return subscription;
  }

  async createCheckoutSession(userId: string, plan: Plan, cycle: TBillingCycle = 'monthly') {
    const priceId = this.getPriceId(plan, cycle);

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:5173';

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer_email: user.email,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${frontendUrl}/settings/billing?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/settings/billing?canceled=true`,
      metadata: { userId, plan, cycle },
      subscription_data: {
        metadata: { userId, plan, cycle },
      },
    });

    return { url: session.url };
  }

  async createBillingPortalSession(userId: string): Promise<{ url: string }> {
    const subscription = await this.prisma.subscription.findUnique({
      where: { userId },
    });

    if (!subscription?.customerId) {
      throw new BadRequestException('No billing customer attached to this account');
    }

    const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:5173';

    const session = await this.stripe.billingPortal.sessions.create({
      customer: subscription.customerId,
      return_url: `${frontendUrl}/settings/billing`,
    });

    if (!session.url) {
      throw new BadRequestException('Failed to create Stripe customer portal session');
    }

    return { url: session.url };
  }

  async handleWebhook(signature: string, payload: Buffer) {
    const webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET')!;
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      throw new BadRequestException(`Webhook Error: ${errorMessage}`);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      await this.processSuccessfulCheckout(session);
    }

    return { received: true };
  }

  private async processSuccessfulCheckout(session: Stripe.Checkout.Session) {
    try {
      const subscriptionId =
        typeof session.subscription === 'string' ? session.subscription : session.subscription?.id;

      if (!subscriptionId) {
        throw new BadRequestException('Subscription ID missing in session');
      }

      const stripeSubscription = await this.stripe.subscriptions.retrieve(subscriptionId);

      const userId = session.metadata?.userId || stripeSubscription.metadata?.userId;
      const plan = (session.metadata?.plan || stripeSubscription.metadata?.plan) as
        Plan | undefined;

      if (!userId || !plan) {
        throw new BadRequestException('User metadata missing in session and subscription');
      }

      const rawCustomer = session.customer ?? stripeSubscription.customer;
      const customerId =
        typeof rawCustomer === 'string'
          ? rawCustomer
          : rawCustomer && 'id' in rawCustomer
            ? rawCustomer.id
            : null;

      const stripeInvoiceId =
        typeof session.invoice === 'string' ? session.invoice : session.invoice?.id;

      const firstItem = stripeSubscription.items.data[0] as
        | (Stripe.SubscriptionItem & { current_period_start?: number; current_period_end?: number })
        | undefined;

      const startTimestamp = firstItem?.current_period_start ?? Math.floor(Date.now() / 1000);
      const endTimestamp =
        firstItem?.current_period_end ?? Math.floor(Date.now() / 1000) + 30 * 86400;

      const currentPeriodStart = new Date(startTimestamp * 1000);
      const currentPeriodEnd = new Date(endTimestamp * 1000);
      const cancelAtPeriodEnd = stripeSubscription.cancel_at_period_end ?? false;

      const rawPaymentIntent =
        typeof session.payment_intent === 'string'
          ? session.payment_intent
          : session.payment_intent?.id;
      const providerTxId = rawPaymentIntent || `tx_${session.id}`;

      await this.prisma.$transaction([
        this.prisma.subscription.upsert({
          where: { userId },
          create: {
            userId,
            plan,
            planStatus: 'ACTIVE',
            customerId,
            subscriptionId,
            currentPeriodStart,
            currentPeriodEnd,
            cancelAtPeriodEnd,
          },
          update: {
            plan,
            planStatus: 'ACTIVE',
            customerId,
            subscriptionId,
            currentPeriodStart,
            currentPeriodEnd,
            cancelAtPeriodEnd,
          },
        }),
        this.prisma.transaction.upsert({
          where: { providerTxId },
          create: {
            userId,
            amount: session.amount_total || 0,
            currency: session.currency || 'usd',
            status: 'SUCCESS',
            plan,
            invoiceId: stripeInvoiceId || session.id,
            providerTxId,
            invoiceUrl: null,
          },
          update: {
            amount: session.amount_total || 0,
            currency: session.currency || 'usd',
            status: 'SUCCESS',
            plan,
            invoiceId: stripeInvoiceId || session.id,
          },
        }),
      ]);
    } catch (error) {
      this.logger.error('CRITICAL ERROR IN PROCESS_SUCCESSFUL_CHECKOUT:', error);
      throw error;
    }
  }

  async syncCheckoutSession(userId: string, sessionId: string) {
    const session = await this.stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status === 'paid' && session.metadata?.userId === userId) {
      await this.processSuccessfulCheckout(session);
    }
    return this.getSubscriptionByUserId(userId);
  }

  async getTransactionsByUserId(userId: string) {
    return this.prisma.transaction.findMany({
      where: { userId },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getInvoiceFilepath(userId: string, transactionId: string): Promise<string> {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id: transactionId },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    if (transaction.userId !== userId) {
      throw new UnauthorizedException('Access denied to this transaction');
    }

    if (!transaction.invoiceUrl) {
      if (!transaction.invoiceId) {
        throw new BadRequestException('Invoice ID is missing for this transaction');
      }

      const stripeInvoice = await this.stripe.invoices.retrieve(transaction.invoiceId);
      if (!stripeInvoice.invoice_pdf) {
        throw new NotFoundException('Invoice PDF is not ready on Stripe side yet');
      }

      const response = await fetch(stripeInvoice.invoice_pdf);
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadDir = path.join(process.cwd(), 'uploads', 'invoices');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const fileName = `invoice_${userId}_${Date.now()}.pdf`;
      const relativePath = path.join('uploads', 'invoices', fileName);

      await fs.promises.writeFile(path.join(process.cwd(), relativePath), buffer);

      await this.prisma.transaction.update({
        where: { id: transactionId },
        data: { invoiceUrl: relativePath },
      });

      return path.resolve(process.cwd(), relativePath);
    }

    const absolutePath = path.resolve(process.cwd(), transaction.invoiceUrl);
    if (!fs.existsSync(absolutePath)) {
      throw new NotFoundException('Invoice file is missing on the server');
    }

    return absolutePath;
  }

  async cancelSubscription(userId: string) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { userId },
    });

    if (!subscription) {
      throw new BadRequestException('Active subscription not found');
    }

    if (subscription.subscriptionId) {
      try {
        await this.stripe.subscriptions.cancel(subscription.subscriptionId);
      } catch (error) {
        this.logger.warn(
          `Failed to cancel Stripe subscription ${subscription.subscriptionId}: ${
            error instanceof Error ? error.message : 'Unknown error'
          }`,
        );
      }
    }

    const updatedSubscription = await this.prisma.subscription.update({
      where: { userId },
      data: {
        plan: Plan.FREE,
        planStatus: 'ACTIVE',
        cancelAtPeriodEnd: false,
        subscriptionId: null,
      },
    });

    return updatedSubscription;
  }
}
