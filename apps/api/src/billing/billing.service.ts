import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Plan } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import Stripe from 'stripe';

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

  private getPriceId(plan: Plan): string {
    const prices: Record<Plan, string | undefined> = {
      [Plan.FREE]: undefined,
      [Plan.PRO]: this.configService.get<string>('STRIPE_PRO_PRICE_ID'),
      [Plan.ENTERPRISE]: this.configService.get<string>('STRIPE_ENTERPRISE_PRICE_ID'),
    };

    const priceId = prices[plan];
    if (!priceId) {
      throw new BadRequestException(`Price ID for plan ${plan} is not configured`);
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

  async createCheckoutSession(userId: string, plan: Plan) {
    const priceId = this.getPriceId(plan);

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
      success_url: `${frontendUrl}/settings/billing?success=true`,
      cancel_url: `${frontendUrl}/settings/billing?canceled=true`,
      metadata: { userId, plan },
      subscription_data: {
        metadata: { userId, plan },
      },
    });

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
      try {
        const session = event.data.object as Stripe.Checkout.Session;

        const subscriptionId = typeof session.subscription === 'string'
          ? session.subscription
          : session.subscription?.id;

        if (!subscriptionId) {
          throw new BadRequestException('Subscription ID missing in session');
        }

        let stripeSubscription: Stripe.Subscription;
        try {
          stripeSubscription = await this.stripe.subscriptions.update(subscriptionId, {
            cancel_at_period_end: true,
          });
        } catch {
          stripeSubscription = await this.stripe.subscriptions.retrieve(subscriptionId);
        }

        const userId = session.metadata?.userId || stripeSubscription.metadata?.userId;
        const plan = (session.metadata?.plan || stripeSubscription.metadata?.plan) as Plan | undefined;

        if (!userId || !plan) {
          throw new BadRequestException('User metadata missing in session and subscription');
        }

        const rawCustomer = session.customer ?? stripeSubscription.customer;
        const customerId = typeof rawCustomer === 'string'
          ? rawCustomer
          : rawCustomer && 'id' in rawCustomer
            ? rawCustomer.id
            : null;

        const firstItem = stripeSubscription.items.data[0] as (Stripe.SubscriptionItem & { current_period_start?: number; current_period_end?: number }) | undefined;

        const startTimestamp = firstItem?.current_period_start ?? Math.floor(Date.now() / 1000);
        const endTimestamp = firstItem?.current_period_end ?? Math.floor(Date.now() / 1000) + 30 * 86400;

        const currentPeriodStart = new Date(startTimestamp * 1000);
        const currentPeriodEnd = new Date(endTimestamp * 1000);
        const cancelAtPeriodEnd = stripeSubscription.cancel_at_period_end ?? false;

        const rawPaymentIntent = typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id;
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
              invoiceId: session.id,
              providerTxId,
              invoiceUrl: typeof session.invoice === 'string' ? session.invoice : '',
            },
            update: {
              amount: session.amount_total || 0,
              currency: session.currency || 'usd',
              status: 'SUCCESS',
              plan,
              invoiceId: session.id,
              invoiceUrl: typeof session.invoice === 'string' ? session.invoice : '',
            },
          }),
        ]);
      } catch (error) {
        this.logger.error('CRITICAL ERROR IN HANDLE_WEBHOOK:', error);
        throw error;
      }
    }

    return { received: true };
  }

  async getTransactionsByUserId(userId: string) {
    return this.prisma.transaction.findMany({
      where: { userId },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}