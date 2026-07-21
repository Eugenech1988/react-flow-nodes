import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Plan } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import Stripe from 'stripe';

@Injectable()
export class BillingService {
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
        plan: 'FREE',
        status: 'ACTIVE',
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
    const isPaidPlan = plan === Plan.PRO || plan === Plan.ENTERPRISE;

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
        ...(isPaidPlan && { cancel_at_period_end: true }),
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
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      const plan = session.metadata?.plan as Plan | undefined;

      if (userId && plan) {
        const subscriptionId = typeof session.subscription === 'string'
          ? session.subscription
          : session.subscription?.id;

        if (!subscriptionId) {
          throw new BadRequestException('Subscription ID missing in session');
        }

        const stripeSubscription = await this.stripe.subscriptions.retrieve(subscriptionId);
        const firstItem = stripeSubscription.items.data[0];

        const startTimestamp = firstItem?.current_period_start ?? Math.floor(Date.now() / 1000);
        const endTimestamp = firstItem?.current_period_end ?? Math.floor(Date.now() / 1000) + 30 * 86400;

        const currentPeriodStart = new Date(startTimestamp * 1000);
        const currentPeriodEnd = new Date(endTimestamp * 1000);
        const cancelAtPeriodEnd = stripeSubscription.cancel_at_period_end;

        await this.prisma.$transaction([
          this.prisma.subscription.upsert({
            where: { userId },
            create: {
              userId,
              plan,
              planStatus: 'ACTIVE',
              currentPeriodStart,
              currentPeriodEnd,
              cancelAtPeriodEnd,
            },
            update: {
              plan,
              planStatus: 'ACTIVE',
              currentPeriodStart,
              currentPeriodEnd,
              cancelAtPeriodEnd,
            },
          }),
          this.prisma.transaction.create({
            data: {
              userId,
              amount: session.amount_total || 0,
              currency: session.currency || 'usd',
              status: 'SUCCESS',
              plan,
              invoiceId: session.id,
              providerTxId: typeof session.payment_intent === 'string' ? session.payment_intent : '',
              invoiceUrl: typeof session.invoice === 'string' ? session.invoice : '',
            },
          }),
        ]);
      }
    }

    return { received: true };
  }
}