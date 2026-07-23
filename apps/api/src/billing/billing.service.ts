import { Injectable, BadRequestException, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Plan } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import Stripe from 'stripe';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

const writeFileAsync = promisify(fs.writeFile);

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

        let invoicePdfUrl = '';
        const stripeInvoiceId = typeof session.invoice === 'string' ? session.invoice : session.invoice?.id;

        if (stripeInvoiceId) {
          try {
            const stripeInvoice = await this.stripe.invoices.retrieve(stripeInvoiceId);
            invoicePdfUrl = stripeInvoice.invoice_pdf || '';
          } catch (e) {
            this.logger.warn(`Could not retrieve stripe invoice ${stripeInvoiceId}:`, e);
          }
        }

        let savedInvoicePath = '';
        if (invoicePdfUrl) {
          try {
            const response = await fetch(invoicePdfUrl);
            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            const uploadDir = path.join(process.cwd(), 'uploads', 'invoices');

            if (!fs.existsSync(uploadDir)) {
              fs.mkdirSync(uploadDir, { recursive: true });
            }

            const fileName = `invoice_${userId}_${Date.now()}.pdf`;
            savedInvoicePath = path.join('uploads', 'invoices', fileName);

            await writeFileAsync(path.join(process.cwd(), savedInvoicePath), buffer);
          } catch (error) {
            this.logger.error(`Failed to download invoice PDF for user ${userId}:`, error);
          }
        }

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
              invoiceId: stripeInvoiceId || session.id,
              providerTxId,
              invoiceUrl: savedInvoicePath,
            },
            update: {
              amount: session.amount_total || 0,
              currency: session.currency || 'usd',
              status: 'SUCCESS',
              plan,
              invoiceId: stripeInvoiceId || session.id,
              invoiceUrl: savedInvoicePath,
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
      throw new BadRequestException('Invoice PDF is not available for this transaction');
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