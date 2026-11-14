import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Plan } from '@prisma/client';
import { BillingService } from '@/billing/billing.service';
import { PrismaService } from '@/prisma/prisma.service';
import * as fs from 'fs';

const mockStripeInvoicesRetrieve = jest.fn();
const mockStripeSubscriptionsRetrieve = jest.fn();
const mockStripeSubscriptionsCancel = jest.fn();
const mockStripeCheckoutSessionsCreate = jest.fn();
const mockStripeCheckoutSessionsRetrieve = jest.fn();
const mockStripeBillingPortalSessionsCreate = jest.fn();
const mockStripeWebhooksConstructEvent = jest.fn();

jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => ({
    invoices: { retrieve: mockStripeInvoicesRetrieve },
    subscriptions: {
      retrieve: mockStripeSubscriptionsRetrieve,
      cancel: mockStripeSubscriptionsCancel,
    },
    checkout: {
      sessions: {
        create: mockStripeCheckoutSessionsCreate,
        retrieve: mockStripeCheckoutSessionsRetrieve,
      },
    },
    billingPortal: {
      sessions: {
        create: mockStripeBillingPortalSessionsCreate,
      },
    },
    webhooks: { constructEvent: mockStripeWebhooksConstructEvent },
  }));
});

jest.mock('fs', () => ({
  existsSync: jest.fn(),
  mkdirSync: jest.fn(),
  promises: { writeFile: jest.fn() },
}));

type TPrismaMock = {
  subscription: { findUnique: jest.Mock; upsert: jest.Mock; update: jest.Mock };
  user: { findUnique: jest.Mock };
  transaction: {
    findUnique: jest.Mock;
    findMany: jest.Mock;
    upsert: jest.Mock;
    update: jest.Mock;
  };
  $transaction: jest.Mock;
};

const createPrismaMock = (): TPrismaMock => ({
  subscription: { findUnique: jest.fn(), upsert: jest.fn(), update: jest.fn() },
  user: { findUnique: jest.fn() },
  transaction: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    upsert: jest.fn(),
    update: jest.fn(),
  },
  $transaction: jest.fn((promises: unknown[]) => Promise.all(promises)),
});

const createConfigMock = (overrides: Record<string, string | undefined> = {}) => ({
  get: jest.fn((key: string) => {
    const defaults: Record<string, string> = {
      STRIPE_SECRET_KEY: 'sk_test_123',
      STRIPE_PRO_PRICE_ID_MONTHLY: 'price_pro_monthly',
      STRIPE_PRO_PRICE_ID_YEARLY: 'price_pro_yearly',
      STRIPE_ENTERPRISE_PRICE_ID: 'price_ent',
      FRONTEND_URL: 'http://localhost:3000',
      CLIENT_URL: 'http://localhost:3000',
      STRIPE_WEBHOOK_SECRET: 'whsec_123',
    };
    return { ...defaults, ...overrides }[key];
  }),
});

global.fetch = jest.fn<Promise<Response>, Parameters<typeof fetch>>();

describe('BillingService', () => {
  let service: BillingService;
  let prisma: TPrismaMock;

  const buildModule = async (overrides?: Record<string, string | undefined>) => {
    const mockPrisma = createPrismaMock();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BillingService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: ConfigService, useValue: createConfigMock(overrides) },
      ],
    }).compile();

    return { service: module.get<BillingService>(BillingService), prisma: mockPrisma };
  };

  beforeEach(async () => {
    const built = await buildModule();
    service = built.service;
    prisma = built.prisma;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getSubscriptionByUserId', () => {
    it('should return subscription if exists', async () => {
      const mockSub = { id: 'sub_1', userId: 'user_1', plan: Plan.PRO };
      prisma.subscription.findUnique.mockResolvedValue(mockSub);

      const result = await service.getSubscriptionByUserId('user_1');
      expect(result).toEqual(mockSub);
    });

    it('should return default FREE plan if subscription not found', async () => {
      prisma.subscription.findUnique.mockResolvedValue(null);

      const result = await service.getSubscriptionByUserId('user_1');
      expect(result.plan).toBe(Plan.FREE);
      expect(result.planStatus).toBe('ACTIVE');
    });
  });

  describe('createCheckoutSession', () => {
    it('should use monthly price id by default', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'user_1', email: 'test@example.com' });
      mockStripeCheckoutSessionsCreate.mockResolvedValue({ url: 'https://stripe.checkout/url' });

      const result = await service.createCheckoutSession('user_1', Plan.PRO);

      expect(result).toEqual({ url: 'https://stripe.checkout/url' });
      expect(mockStripeCheckoutSessionsCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          customer_email: 'test@example.com',
          line_items: [{ price: 'price_pro_monthly', quantity: 1 }],
          metadata: expect.objectContaining({ cycle: 'monthly' }),
        }),
      );
    });

    it('should use monthly price id when cycle=monthly', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'user_1', email: 'test@example.com' });
      mockStripeCheckoutSessionsCreate.mockResolvedValue({ url: 'https://stripe.checkout/url' });

      await service.createCheckoutSession('user_1', Plan.PRO, 'monthly');

      expect(mockStripeCheckoutSessionsCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          line_items: [{ price: 'price_pro_monthly', quantity: 1 }],
        }),
      );
    });

    it('should use yearly price id when cycle=yearly', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'user_1', email: 'test@example.com' });
      mockStripeCheckoutSessionsCreate.mockResolvedValue({ url: 'https://stripe.checkout/url' });

      await service.createCheckoutSession('user_1', Plan.PRO, 'yearly');

      expect(mockStripeCheckoutSessionsCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          line_items: [{ price: 'price_pro_yearly', quantity: 1 }],
          metadata: expect.objectContaining({ cycle: 'yearly' }),
          subscription_data: expect.objectContaining({
            metadata: expect.objectContaining({ cycle: 'yearly' }),
          }),
        }),
      );
    });

    it('should throw BadRequestException if user is missing', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      await expect(service.createCheckoutSession('user_1', Plan.PRO)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException when free plan requested', async () => {
      await expect(service.createCheckoutSession('user_1', Plan.FREE)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException when monthly price is not configured', async () => {
      const local = await buildModule({ STRIPE_PRO_PRICE_ID_MONTHLY: undefined });
      local.prisma.user.findUnique.mockResolvedValue({ id: 'user_1', email: 'test@example.com' });

      await expect(
        local.service.createCheckoutSession('user_1', Plan.PRO, 'monthly'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when yearly price is not configured', async () => {
      const local = await buildModule({ STRIPE_PRO_PRICE_ID_YEARLY: undefined });
      local.prisma.user.findUnique.mockResolvedValue({ id: 'user_1', email: 'test@example.com' });

      await expect(
        local.service.createCheckoutSession('user_1', Plan.PRO, 'yearly'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should fallback to localhost when FRONTEND_URL is missing', async () => {
      const local = await buildModule({ FRONTEND_URL: undefined });
      local.prisma.user.findUnique.mockResolvedValue({ id: 'user_1', email: 'test@example.com' });
      mockStripeCheckoutSessionsCreate.mockResolvedValue({ url: 'https://stripe.com' });

      await local.service.createCheckoutSession('user_1', Plan.PRO, 'yearly');

      expect(mockStripeCheckoutSessionsCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          success_url: expect.stringContaining('http://localhost:5173'),
          cancel_url: expect.stringContaining('http://localhost:5173'),
        }),
      );
    });
  });

  describe('createBillingPortalSession', () => {
    it('should create portal session and return url', async () => {
      prisma.subscription.findUnique.mockResolvedValue({ customerId: 'cus_123' });
      mockStripeBillingPortalSessionsCreate.mockResolvedValue({
        url: 'https://stripe.portal/session',
      });

      const result = await service.createBillingPortalSession('user_1');

      expect(mockStripeBillingPortalSessionsCreate).toHaveBeenCalledWith({
        customer: 'cus_123',
        return_url: expect.stringContaining('/settings/billing'),
      });
      expect(result).toEqual({ url: 'https://stripe.portal/session' });
    });

    it('should throw when subscription is missing', async () => {
      prisma.subscription.findUnique.mockResolvedValue(null);

      await expect(service.createBillingPortalSession('user_1')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw when customerId is missing', async () => {
      prisma.subscription.findUnique.mockResolvedValue({ customerId: null });

      await expect(service.createBillingPortalSession('user_1')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw when Stripe returns no url', async () => {
      prisma.subscription.findUnique.mockResolvedValue({ customerId: 'cus_123' });
      mockStripeBillingPortalSessionsCreate.mockResolvedValue({ url: null });

      await expect(service.createBillingPortalSession('user_1')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('handleWebhook', () => {
    it('should handle checkout.session.completed webhook event', async () => {
      mockStripeWebhooksConstructEvent.mockReturnValue({
        type: 'checkout.session.completed',
        data: {
          object: {
            id: 'cs_123',
            subscription: 'sub_123',
            metadata: { userId: 'user_1', plan: Plan.PRO },
            customer: 'cus_123',
            payment_intent: 'pi_123',
          },
        },
      });

      mockStripeSubscriptionsRetrieve.mockResolvedValue({
        id: 'sub_123',
        items: { data: [{ current_period_start: 1000, current_period_end: 2000 }] },
      });

      const result = await service.handleWebhook('sig_123', Buffer.from('payload'));

      expect(result).toEqual({ received: true });
      expect(prisma.$transaction).toHaveBeenCalled();
    });

    it('should set customerId to null when customer object has no id', async () => {
      mockStripeWebhooksConstructEvent.mockReturnValue({
        type: 'checkout.session.completed',
        data: {
          object: {
            id: 'cs_4',
            subscription: 'sub_123',
            metadata: { userId: 'user_1', plan: Plan.PRO },
            customer: {},
            payment_intent: 'pi_123',
          },
        },
      });

      mockStripeSubscriptionsRetrieve.mockResolvedValue({
        id: 'sub_123',
        metadata: {},
        items: { data: [] },
        customer: {},
      });

      prisma.$transaction.mockResolvedValueOnce([]);

      await service.handleWebhook('sig', Buffer.from('payload'));

      expect(prisma.subscription.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          create: expect.objectContaining({ customerId: null }),
        }),
      );
    });

    it('should handle invoice as string', async () => {
      mockStripeWebhooksConstructEvent.mockReturnValue({
        type: 'checkout.session.completed',
        data: {
          object: {
            id: 'cs_7',
            subscription: 'sub_123',
            metadata: { userId: 'user_1', plan: Plan.PRO },
            customer: 'cus_123',
            payment_intent: 'pi_123',
            invoice: 'inv_string_123',
          },
        },
      });

      mockStripeSubscriptionsRetrieve.mockResolvedValue({
        id: 'sub_123',
        metadata: {},
        items: { data: [] },
      });

      prisma.$transaction.mockResolvedValueOnce([]);

      await service.handleWebhook('sig', Buffer.from('payload'));

      expect(prisma.transaction.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          create: expect.objectContaining({ invoiceId: 'inv_string_123' }),
        }),
      );
    });

    it('should fallback to session.id when invoice is missing', async () => {
      mockStripeWebhooksConstructEvent.mockReturnValue({
        type: 'checkout.session.completed',
        data: {
          object: {
            id: 'cs_8',
            subscription: 'sub_123',
            metadata: { userId: 'user_1', plan: Plan.PRO },
            customer: 'cus_123',
            payment_intent: 'pi_123',
          },
        },
      });

      mockStripeSubscriptionsRetrieve.mockResolvedValue({
        id: 'sub_123',
        metadata: {},
        items: { data: [] },
      });

      prisma.$transaction.mockResolvedValueOnce([]);

      await service.handleWebhook('sig', Buffer.from('payload'));

      expect(prisma.transaction.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          create: expect.objectContaining({ invoiceId: 'cs_8' }),
        }),
      );
    });

    it('should use generated providerTxId when payment_intent is missing', async () => {
      mockStripeWebhooksConstructEvent.mockReturnValue({
        type: 'checkout.session.completed',
        data: {
          object: {
            id: 'cs_5',
            subscription: 'sub_123',
            metadata: { userId: 'user_1', plan: Plan.PRO },
            customer: 'cus_123',
          },
        },
      });

      mockStripeSubscriptionsRetrieve.mockResolvedValue({
        id: 'sub_123',
        metadata: {},
        items: { data: [] },
      });

      prisma.$transaction.mockResolvedValueOnce([]);

      await service.handleWebhook('sig', Buffer.from('payload'));

      expect(prisma.transaction.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { providerTxId: 'tx_cs_5' },
        }),
      );
    });

    it('should use generated providerTxId when payment_intent is null', async () => {
      mockStripeWebhooksConstructEvent.mockReturnValue({
        type: 'checkout.session.completed',
        data: {
          object: {
            id: 'cs_6',
            subscription: 'sub_123',
            metadata: { userId: 'user_1', plan: Plan.PRO },
            customer: 'cus_123',
            payment_intent: null,
          },
        },
      });

      mockStripeSubscriptionsRetrieve.mockResolvedValue({
        id: 'sub_123',
        metadata: {},
        items: { data: [] },
      });

      prisma.$transaction.mockResolvedValueOnce([]);

      await service.handleWebhook('sig', Buffer.from('payload'));

      expect(prisma.transaction.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { providerTxId: 'tx_cs_6' },
        }),
      );
    });

    it('should throw BadRequestException on invalid signature', async () => {
      mockStripeWebhooksConstructEvent.mockImplementation(() => {
        throw new Error('Invalid signature');
      });

      await expect(service.handleWebhook('invalid_sig', Buffer.from('payload'))).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should handle non-Error thrown by constructEvent', async () => {
      mockStripeWebhooksConstructEvent.mockImplementation(() => {
        throw 'string error';
      });

      await expect(service.handleWebhook('sig', Buffer.from('payload'))).rejects.toThrow(
        'Webhook Error: Unknown error',
      );
    });

    it('should skip processing for non-checkout.session.completed events', async () => {
      mockStripeWebhooksConstructEvent.mockReturnValue({
        type: 'invoice.payment_succeeded',
        data: { object: {} },
      });

      const result = await service.handleWebhook('sig', Buffer.from('payload'));

      expect(result).toEqual({ received: true });
      expect(prisma.$transaction).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when subscription id is missing', async () => {
      mockStripeWebhooksConstructEvent.mockReturnValue({
        type: 'checkout.session.completed',
        data: {
          object: {
            id: 'cs_123',
            subscription: null,
            metadata: { userId: 'user_1', plan: Plan.PRO },
          },
        },
      });

      await expect(service.handleWebhook('sig', Buffer.from('payload'))).rejects.toThrow(
        'Subscription ID missing in session',
      );
    });

    it('should throw BadRequestException when metadata is missing', async () => {
      mockStripeWebhooksConstructEvent.mockReturnValue({
        type: 'checkout.session.completed',
        data: {
          object: {
            id: 'cs_123',
            subscription: 'sub_123',
            metadata: {},
          },
        },
      });

      mockStripeSubscriptionsRetrieve.mockResolvedValue({
        id: 'sub_123',
        metadata: {},
        items: { data: [] },
      });

      await expect(service.handleWebhook('sig', Buffer.from('payload'))).rejects.toThrow(
        'User metadata missing in session and subscription',
      );
    });

    it('should throw when userId present but plan is missing', async () => {
      mockStripeWebhooksConstructEvent.mockReturnValue({
        type: 'checkout.session.completed',
        data: {
          object: {
            id: 'cs_1',
            subscription: 'sub_123',
            metadata: { userId: 'user_1' },
          },
        },
      });

      mockStripeSubscriptionsRetrieve.mockResolvedValue({
        id: 'sub_123',
        metadata: {},
        items: { data: [] },
      });

      await expect(service.handleWebhook('sig', Buffer.from('payload'))).rejects.toThrow(
        'User metadata missing in session and subscription',
      );
    });

    it('should throw when plan present but userId is missing', async () => {
      mockStripeWebhooksConstructEvent.mockReturnValue({
        type: 'checkout.session.completed',
        data: {
          object: {
            id: 'cs_1',
            subscription: 'sub_123',
            metadata: { plan: Plan.PRO },
          },
        },
      });

      mockStripeSubscriptionsRetrieve.mockResolvedValue({
        id: 'sub_123',
        metadata: {},
        items: { data: [] },
      });

      await expect(service.handleWebhook('sig', Buffer.from('payload'))).rejects.toThrow(
        'User metadata missing in session and subscription',
      );
    });

    it('should handle object-form subscription, customer, invoice and payment_intent', async () => {
      mockStripeWebhooksConstructEvent.mockReturnValue({
        type: 'checkout.session.completed',
        data: {
          object: {
            id: 'cs_1',
            subscription: { id: 'sub_obj_1' },
            metadata: { userId: 'user_1', plan: Plan.PRO },
            customer: { id: 'cus_obj_1' },
            invoice: { id: 'inv_obj_1' },
            payment_intent: { id: 'pi_obj_1' },
            amount_total: 1000,
            currency: 'usd',
          },
        },
      });

      mockStripeSubscriptionsRetrieve.mockResolvedValue({
        id: 'sub_obj_1',
        metadata: {},
        items: { data: [{ current_period_start: 1000, current_period_end: 2000 }] },
        cancel_at_period_end: true,
      });

      prisma.$transaction.mockResolvedValueOnce([]);

      const result = await service.handleWebhook('sig', Buffer.from('payload'));

      expect(result).toEqual({ received: true });
      expect(mockStripeSubscriptionsRetrieve).toHaveBeenCalledWith('sub_obj_1');
      expect(prisma.$transaction).toHaveBeenCalled();
    });

    it('should fallback userId/plan from stripeSubscription.metadata', async () => {
      mockStripeWebhooksConstructEvent.mockReturnValue({
        type: 'checkout.session.completed',
        data: {
          object: {
            id: 'cs_2',
            subscription: 'sub_123',
            metadata: {},
            customer: 'cus_123',
            payment_intent: 'pi_123',
          },
        },
      });

      mockStripeSubscriptionsRetrieve.mockResolvedValue({
        id: 'sub_123',
        metadata: { userId: 'user_from_sub', plan: Plan.PRO },
        items: { data: [] },
      });

      prisma.$transaction.mockResolvedValueOnce([]);

      await service.handleWebhook('sig', Buffer.from('payload'));

      expect(prisma.$transaction).toHaveBeenCalled();
    });

    it('should use null customerId when customer is missing everywhere', async () => {
      mockStripeWebhooksConstructEvent.mockReturnValue({
        type: 'checkout.session.completed',
        data: {
          object: {
            id: 'cs_3',
            subscription: 'sub_123',
            metadata: { userId: 'user_1', plan: Plan.PRO },
            payment_intent: 'pi_123',
          },
        },
      });

      mockStripeSubscriptionsRetrieve.mockResolvedValue({
        id: 'sub_123',
        metadata: {},
        items: { data: [] },
        customer: null,
      });

      prisma.$transaction.mockResolvedValueOnce([]);

      await service.handleWebhook('sig', Buffer.from('payload'));

      expect(prisma.subscription.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          create: expect.objectContaining({ customerId: null }),
        }),
      );
    });
  });

  describe('syncCheckoutSession', () => {
    it('should process checkout if paid and userId matches', async () => {
      mockStripeCheckoutSessionsRetrieve.mockResolvedValue({
        id: 'cs_123',
        payment_status: 'paid',
        metadata: { userId: 'user_1', plan: Plan.PRO },
        subscription: 'sub_123',
        customer: 'cus_123',
        payment_intent: 'pi_123',
        amount_total: 1000,
        currency: 'usd',
      });

      mockStripeSubscriptionsRetrieve.mockResolvedValue({
        id: 'sub_123',
        metadata: {},
        items: { data: [] },
      });

      prisma.$transaction.mockResolvedValueOnce([]);
      prisma.subscription.findUnique.mockResolvedValue({ plan: Plan.PRO });

      const result = await service.syncCheckoutSession('user_1', 'cs_123');

      expect(prisma.$transaction).toHaveBeenCalled();
      expect(result.plan).toBe(Plan.PRO);
    });

    it('should skip if payment_status is unpaid', async () => {
      mockStripeCheckoutSessionsRetrieve.mockResolvedValue({
        id: 'cs_123',
        payment_status: 'unpaid',
        metadata: { userId: 'user_1' },
      });

      prisma.subscription.findUnique.mockResolvedValue({ plan: Plan.FREE });

      await service.syncCheckoutSession('user_1', 'cs_123');

      expect(prisma.$transaction).not.toHaveBeenCalled();
    });

    it('should skip if userId does not match', async () => {
      mockStripeCheckoutSessionsRetrieve.mockResolvedValue({
        id: 'cs_123',
        payment_status: 'paid',
        metadata: { userId: 'other_user' },
      });

      prisma.subscription.findUnique.mockResolvedValue({ plan: Plan.FREE });

      await service.syncCheckoutSession('user_1', 'cs_123');

      expect(prisma.$transaction).not.toHaveBeenCalled();
    });

    it('should skip when session.metadata is undefined', async () => {
      mockStripeCheckoutSessionsRetrieve.mockResolvedValue({
        id: 'cs_123',
        payment_status: 'paid',
        metadata: undefined,
      });

      prisma.subscription.findUnique.mockResolvedValue({ plan: Plan.FREE });

      await service.syncCheckoutSession('user_1', 'cs_123');

      expect(prisma.$transaction).not.toHaveBeenCalled();
    });
  });

  describe('getTransactionsByUserId', () => {
    it('should return transactions ordered by createdAt desc', async () => {
      const mockTx = [{ id: 'tx_1', amount: 1000 }];
      prisma.transaction.findMany.mockResolvedValue(mockTx);

      const result = await service.getTransactionsByUserId('user_1');

      expect(prisma.transaction.findMany).toHaveBeenCalledWith({
        where: { userId: 'user_1' },
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(mockTx);
    });
  });

  describe('getInvoiceFilepath', () => {
    it('should throw NotFoundException if transaction does not exist', async () => {
      prisma.transaction.findUnique.mockResolvedValue(null);
      await expect(service.getInvoiceFilepath('user_1', 'tx_1')).rejects.toThrow(NotFoundException);
    });

    it('should throw UnauthorizedException if transaction belongs to another user', async () => {
      prisma.transaction.findUnique.mockResolvedValue({ id: 'tx_1', userId: 'other_user' });
      await expect(service.getInvoiceFilepath('user_1', 'tx_1')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw BadRequestException if invoiceId is missing', async () => {
      prisma.transaction.findUnique.mockResolvedValue({
        id: 'tx_1',
        userId: 'user_1',
        invoiceUrl: null,
        invoiceId: null,
      });

      await expect(service.getInvoiceFilepath('user_1', 'tx_1')).rejects.toThrow(
        'Invoice ID is missing',
      );
    });

    it('should throw NotFoundException if Stripe PDF is not ready', async () => {
      prisma.transaction.findUnique.mockResolvedValue({
        id: 'tx_1',
        userId: 'user_1',
        invoiceUrl: null,
        invoiceId: 'inv_123',
      });
      mockStripeInvoicesRetrieve.mockResolvedValue({ invoice_pdf: null });

      await expect(service.getInvoiceFilepath('user_1', 'tx_1')).rejects.toThrow(
        'Invoice PDF is not ready',
      );
    });

    it('should fetch PDF, save it and update DB', async () => {
      prisma.transaction.findUnique.mockResolvedValue({
        id: 'tx_1',
        userId: 'user_1',
        invoiceUrl: null,
        invoiceId: 'inv_123',
      });
      mockStripeInvoicesRetrieve.mockResolvedValue({
        invoice_pdf: 'https://stripe.com/invoice.pdf',
      });
      jest.mocked(global.fetch).mockResolvedValue({
        arrayBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(8)),
      } as unknown as Response);
      jest.mocked(fs.existsSync).mockReturnValue(false);
      prisma.transaction.update.mockResolvedValue({});

      const result = await service.getInvoiceFilepath('user_1', 'tx_1');

      expect(mockStripeInvoicesRetrieve).toHaveBeenCalledWith('inv_123');
      expect(fs.mkdirSync).toHaveBeenCalled();
      expect(fs.promises.writeFile).toHaveBeenCalled();
      expect(prisma.transaction.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'tx_1' },
          data: expect.objectContaining({ invoiceUrl: expect.any(String) }),
        }),
      );
      expect(result).toContain('uploads/invoices/');
    });

    it('should skip mkdirSync when upload directory already exists', async () => {
      prisma.transaction.findUnique.mockResolvedValue({
        id: 'tx_1',
        userId: 'user_1',
        invoiceUrl: null,
        invoiceId: 'inv_123',
      });
      mockStripeInvoicesRetrieve.mockResolvedValue({
        invoice_pdf: 'https://stripe.com/invoice.pdf',
      });
      jest.mocked(global.fetch).mockResolvedValue({
        arrayBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(8)),
      } as unknown as Response);
      jest.mocked(fs.existsSync).mockReturnValue(true);
      prisma.transaction.update.mockResolvedValue({});

      await service.getInvoiceFilepath('user_1', 'tx_1');

      expect(fs.mkdirSync).not.toHaveBeenCalled();
      expect(fs.promises.writeFile).toHaveBeenCalled();
    });

    it('should return absolute path if invoice file already exists locally', async () => {
      prisma.transaction.findUnique.mockResolvedValue({
        id: 'tx_1',
        userId: 'user_1',
        invoiceUrl: 'uploads/invoices/test.pdf',
      });
      jest.mocked(fs.existsSync).mockReturnValue(true);

      const filePath = await service.getInvoiceFilepath('user_1', 'tx_1');
      expect(filePath).toContain('uploads/invoices/test.pdf');
    });

    it('should throw NotFoundException if existing file is missing on disk', async () => {
      prisma.transaction.findUnique.mockResolvedValue({
        id: 'tx_1',
        userId: 'user_1',
        invoiceUrl: 'uploads/invoices/missing.pdf',
      });
      jest.mocked(fs.existsSync).mockReturnValue(false);

      await expect(service.getInvoiceFilepath('user_1', 'tx_1')).rejects.toThrow(
        'Invoice file is missing on the server',
      );
    });
  });

  describe('cancelSubscription', () => {
    it('should cancel stripe subscription and update local record', async () => {
      prisma.subscription.findUnique.mockResolvedValue({
        userId: 'user_1',
        subscriptionId: 'sub_123',
      });
      prisma.subscription.update.mockResolvedValue({ userId: 'user_1', plan: Plan.FREE });

      const result = await service.cancelSubscription('user_1');

      expect(mockStripeSubscriptionsCancel).toHaveBeenCalledWith('sub_123');
      expect(prisma.subscription.update).toHaveBeenCalledWith({
        where: { userId: 'user_1' },
        data: expect.objectContaining({ plan: Plan.FREE }),
      });
      expect(result.plan).toBe(Plan.FREE);
    });

    it('should throw BadRequestException if no active subscription found', async () => {
      prisma.subscription.findUnique.mockResolvedValue(null);
      await expect(service.cancelSubscription('user_1')).rejects.toThrow(BadRequestException);
    });

    it('should still update local subscription when Stripe cancel throws', async () => {
      prisma.subscription.findUnique.mockResolvedValue({
        userId: 'user_1',
        subscriptionId: 'sub_123',
      });
      mockStripeSubscriptionsCancel.mockRejectedValueOnce(new Error('Already cancelled'));
      prisma.subscription.update.mockResolvedValue({ plan: Plan.FREE });

      const result = await service.cancelSubscription('user_1');

      expect(result.plan).toBe(Plan.FREE);
      expect(prisma.subscription.update).toHaveBeenCalled();
    });

    it('should handle non-Error thrown by Stripe cancel', async () => {
      prisma.subscription.findUnique.mockResolvedValue({
        userId: 'user_1',
        subscriptionId: 'sub_123',
      });
      mockStripeSubscriptionsCancel.mockRejectedValueOnce('string error');
      prisma.subscription.update.mockResolvedValue({ plan: Plan.FREE });

      const result = await service.cancelSubscription('user_1');

      expect(result.plan).toBe(Plan.FREE);
    });

    it('should skip Stripe call when subscriptionId is null', async () => {
      prisma.subscription.findUnique.mockResolvedValue({
        userId: 'user_1',
        subscriptionId: null,
      });
      prisma.subscription.update.mockResolvedValue({ plan: Plan.FREE });

      await service.cancelSubscription('user_1');

      expect(mockStripeSubscriptionsCancel).not.toHaveBeenCalled();
    });
  });
});
