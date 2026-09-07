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
const mockStripeWebhooksConstructEvent = jest.fn();

jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => ({
    invoices: { retrieve: mockStripeInvoicesRetrieve },
    subscriptions: { retrieve: mockStripeSubscriptionsRetrieve, cancel: mockStripeSubscriptionsCancel },
    checkout: {
      sessions: { create: mockStripeCheckoutSessionsCreate, retrieve: mockStripeCheckoutSessionsRetrieve },
    },
    webhooks: { constructEvent: mockStripeWebhooksConstructEvent },
  }));
});

jest.mock('fs', () => ({
  existsSync: jest.fn(),
  mkdirSync: jest.fn(),
  promises: { writeFile: jest.fn() },
}));

global.fetch = jest.fn();

describe('BillingService', () => {
  let service: BillingService;
  let prisma: any;
  let configService: any;

  beforeEach(async () => {
    const mockPrisma = {
      subscription: { findUnique: jest.fn(), upsert: jest.fn(), update: jest.fn() },
      user: { findUnique: jest.fn() },
      transaction: { findUnique: jest.fn(), findMany: jest.fn(), upsert: jest.fn(), update: jest.fn() },
      $transaction: jest.fn((promises) => Promise.all(promises)),
    };

    const mockConfig = {
      get: jest.fn((key: string) => {
        const env: Record<string, string> = {
          STRIPE_SECRET_KEY: 'sk_test_123',
          STRIPE_PRO_PRICE_ID: 'price_pro',
          STRIPE_ENTERPRISE_PRICE_ID: 'price_ent',
          FRONTEND_URL: 'http://localhost:3000',
          STRIPE_WEBHOOK_SECRET: 'whsec_123',
        };
        return env[key];
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BillingService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: ConfigService, useValue: mockConfig },
      ],
    }).compile();

    service = module.get<BillingService>(BillingService);
    prisma = module.get<PrismaService>(PrismaService);
    configService = module.get<ConfigService>(ConfigService);
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
    it('should create stripe checkout session', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'user_1', email: 'test@example.com' });
      mockStripeCheckoutSessionsCreate.mockResolvedValue({ url: 'https://stripe.checkout/url' });

      const result = await service.createCheckoutSession('user_1', Plan.PRO);

      expect(result).toEqual({ url: 'https://stripe.checkout/url' });
      expect(mockStripeCheckoutSessionsCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          customer_email: 'test@example.com',
          line_items: [{ price: 'price_pro', quantity: 1 }],
        }),
      );
    });

    it('should throw BadRequestException if user is missing', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      await expect(service.createCheckoutSession('user_1', Plan.PRO)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException for unconfigured plan price', async () => {
      await expect(service.createCheckoutSession('user_1', Plan.FREE)).rejects.toThrow(BadRequestException);
    });
  });

  describe('handleWebhook', () => {
    it('should handle checkout.session.completed webhook event', async () => {
      const mockSession = {
        id: 'cs_123',
        subscription: 'sub_123',
        metadata: { userId: 'user_1', plan: Plan.PRO },
        customer: 'cus_123',
        payment_intent: 'pi_123',
      };

      mockStripeWebhooksConstructEvent.mockReturnValue({
        type: 'checkout.session.completed',
        data: { object: mockSession },
      });

      mockStripeSubscriptionsRetrieve.mockResolvedValue({
        id: 'sub_123',
        items: { data: [{ current_period_start: 1000, current_period_end: 2000 }] },
      });

      const result = await service.handleWebhook('sig_123', Buffer.from('payload'));

      expect(result).toEqual({ received: true });
      expect(prisma.$transaction).toHaveBeenCalled();
    });

    it('should throw BadRequestException on invalid signature', async () => {
      mockStripeWebhooksConstructEvent.mockImplementation(() => {
        throw new Error('Invalid signature');
      });

      await expect(service.handleWebhook('invalid_sig', Buffer.from('payload'))).rejects.toThrow(BadRequestException);
    });
  });

  describe('getInvoiceFilepath', () => {
    it('should throw NotFoundException if transaction does not exist', async () => {
      prisma.transaction.findUnique.mockResolvedValue(null);
      await expect(service.getInvoiceFilepath('user_1', 'tx_1')).rejects.toThrow(NotFoundException);
    });

    it('should throw UnauthorizedException if transaction belongs to another user', async () => {
      prisma.transaction.findUnique.mockResolvedValue({ id: 'tx_1', userId: 'other_user' });
      await expect(service.getInvoiceFilepath('user_1', 'tx_1')).rejects.toThrow(UnauthorizedException);
    });

    it('should return absolute path if invoice file already exists locally', async () => {
      prisma.transaction.findUnique.mockResolvedValue({
        id: 'tx_1',
        userId: 'user_1',
        invoiceUrl: 'uploads/invoices/test.pdf',
      });
      (fs.existsSync as jest.Mock).mockReturnValue(true);

      const filePath = await service.getInvoiceFilepath('user_1', 'tx_1');
      expect(filePath).toContain('uploads/invoices/test.pdf');
    });
  });

  describe('cancelSubscription', () => {
    it('should cancel stripe subscription and update local record', async () => {
      prisma.subscription.findUnique.mockResolvedValue({ userId: 'user_1', subscriptionId: 'sub_123' });
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
  });
});