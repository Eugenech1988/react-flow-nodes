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
      apiVersion: '2025-02-28.acacia' as any,
    });
  }

  private getPriceId(plan: Plan): string {
    const prices = {
      [Plan.PRO]: this.configService.get<string>('STRIPE_PRO_PRICE_ID')!,
      [Plan.ENTERPRISE]: this.configService.get<string>('STRIPE_ENTERPRISE_PRICE_ID')!,
    };
    return prices[plan];
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
      };
    }

    return subscription;
  }

  async createCheckoutSession(userId: string, plan: Plan) {
    const priceId = this.getPriceId(plan);
    if (!priceId) {
      throw new BadRequestException('Invalid plan selected');
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer_email: user.email,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${this.configService.get('FRONTEND_URL')}/settings/billing?success=true`,
      cancel_url: `${this.configService.get('FRONTEND_URL')}/settings/billing?canceled=true`,
      metadata: { userId, plan },
    });

    return { url: session.url };
  }

  async handleWebhook(signature: string, payload: Buffer) {
    const webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET')!;
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    } catch (err) {
      throw new BadRequestException(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      const plan = session.metadata?.plan as Plan;

      if (userId && plan) {
        const subscriptionId = session.subscription as string;
        const stripeSubscription = await this.stripe.subscriptions.retrieve(subscriptionId);

        const currentPeriodStart = new Date(stripeSubscription.items.data[0].created * 1000);
        const currentPeriodEnd = new Date((stripeSubscription as any).current_period_end * 1000);

        await this.prisma.$transaction([
          this.prisma.subscription.upsert({
            where: { userId },
            create: {
              userId,
              plan,
              planStatus: 'ACTIVE',
              currentPeriodStart,
              currentPeriodEnd,
            },
            update: {
              plan,
              planStatus: 'ACTIVE',
              currentPeriodStart,
              currentPeriodEnd,
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
              providerTxId: session.payment_intent as string,
              invoiceUrl: session.invoice as string,
            },
          }),
        ]);
      }
    }

    return { received: true };
  }
}