import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { Plan, TransactionStatus } from '@prisma/client';
import type { Subscription, Transaction } from '@prisma/client';
import { BillingController } from '@/billing/billing.controller';
import { BillingService } from '@/billing/billing.service';

type TAuthedRequest = Parameters<BillingController['getSubscription']>[0];
type TResponseMock = Parameters<BillingController['downloadInvoice']>[2];
type TWebhookRequest = Parameters<BillingController['handleStripeWebhook']>[1];

const createMockTransaction = (overrides: Partial<Transaction> = {}): Transaction => ({
  id: 'tx_1',
  userId: 'user_1',
  plan: Plan.PRO,
  invoiceId: null,
  providerTxId: 'pi_123',
  amount: 1000,
  currency: 'usd',
  status: TransactionStatus.SUCCESS,
  invoiceUrl: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

const createMockSubscription = (overrides: Partial<Subscription> = {}): Subscription => ({
  id: 'sub_1',
  userId: 'user_1',
  plan: Plan.PRO,
  planStatus: 'ACTIVE',
  customerId: null,
  subscriptionId: null,
  currentPeriodStart: new Date(),
  currentPeriodEnd: new Date(),
  cancelAtPeriodEnd: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

describe('BillingController', () => {
  let controller: BillingController;
  let service: jest.Mocked<BillingService>;

  beforeEach(async () => {
    const mockBillingService: jest.Mocked<Partial<BillingService>> = {
      createCheckoutSession: jest.fn(),
      createBillingPortalSession: jest.fn(),
      getSubscriptionByUserId: jest.fn(),
      handleWebhook: jest.fn(),
      getTransactionsByUserId: jest.fn(),
      getInvoiceFilepath: jest.fn(),
      cancelSubscription: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [BillingController],
      providers: [{ provide: BillingService, useValue: mockBillingService }],
    }).compile();

    controller = module.get<BillingController>(BillingController);
    service = module.get(BillingService) as jest.Mocked<BillingService>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createCheckout', () => {
    it('should call createCheckoutSession with plan and cycle', async () => {
      const mockReq = { user: { id: 'user_1' } } as unknown as TAuthedRequest;
      service.createCheckoutSession.mockResolvedValue({ url: 'http://stripe.com' });

      const res = await controller.createCheckout(mockReq, {
        plan: 'PRO',
        cycle: 'monthly',
      });

      expect(service.createCheckoutSession).toHaveBeenCalledWith('user_1', 'PRO', 'monthly');
      expect(res).toEqual({ url: 'http://stripe.com' });
    });

    it('should pass yearly cycle when provided', async () => {
      const mockReq = { user: { id: 'user_1' } } as unknown as TAuthedRequest;
      service.createCheckoutSession.mockResolvedValue({ url: 'http://stripe.com' });

      await controller.createCheckout(mockReq, {
        plan: 'PRO',
        cycle: 'yearly',
      });

      expect(service.createCheckoutSession).toHaveBeenCalledWith('user_1', 'PRO', 'yearly');
    });

    it('should throw BadRequestException when plan is invalid', async () => {
      const mockReq = { user: { id: 'user_1' } } as unknown as TAuthedRequest;

      await expect(
        controller.createCheckout(mockReq, { plan: 'FREE', cycle: 'monthly' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when cycle is invalid', async () => {
      const mockReq = { user: { id: 'user_1' } } as unknown as TAuthedRequest;

      await expect(
        controller.createCheckout(mockReq, { plan: 'PRO', cycle: 'weekly' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when payload is malformed', async () => {
      const mockReq = { user: { id: 'user_1' } } as unknown as TAuthedRequest;

      await expect(controller.createCheckout(mockReq, {})).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when user is missing', async () => {
      const mockReq = {} as unknown as TAuthedRequest;

      await expect(
        controller.createCheckout(mockReq, { plan: 'PRO', cycle: 'monthly' }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('getSubscription', () => {
    it('should return subscription for current user', async () => {
      const mockReq = { user: { id: 'user_1' } } as unknown as TAuthedRequest;
      service.getSubscriptionByUserId.mockResolvedValue(createMockSubscription({ plan: Plan.PRO }));

      const result = await controller.getSubscription(mockReq);

      expect(service.getSubscriptionByUserId).toHaveBeenCalledWith('user_1');
      expect(result).toEqual(expect.objectContaining({ plan: Plan.PRO }));
    });
  });

  describe('openBillingPortal', () => {
    it('should redirect to Stripe customer portal url', async () => {
      const mockReq = { user: { id: 'user_1' } } as unknown as TAuthedRequest;
      const mockRes = { redirect: jest.fn() } as unknown as TResponseMock;
      service.createBillingPortalSession.mockResolvedValue({
        url: 'https://stripe.portal/session',
      });

      await controller.openBillingPortal(mockReq, mockRes);

      expect(service.createBillingPortalSession).toHaveBeenCalledWith('user_1');
      expect(mockRes.redirect).toHaveBeenCalledWith('https://stripe.portal/session');
    });

    it('should propagate service errors', async () => {
      const mockReq = { user: { id: 'user_1' } } as unknown as TAuthedRequest;
      const mockRes = { redirect: jest.fn() } as unknown as TResponseMock;
      service.createBillingPortalSession.mockRejectedValue(
        new BadRequestException('No billing customer attached'),
      );

      await expect(controller.openBillingPortal(mockReq, mockRes)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockRes.redirect).not.toHaveBeenCalled();
    });
  });

  describe('handleStripeWebhook', () => {
    it('should call handleWebhook with signature and raw body', async () => {
      const mockReq = { rawBody: Buffer.from('raw_body_data') } as unknown as TWebhookRequest;
      service.handleWebhook.mockResolvedValue({ received: true });

      const res = await controller.handleStripeWebhook('sig_123', mockReq);

      expect(service.handleWebhook).toHaveBeenCalledWith('sig_123', mockReq.rawBody);
      expect(res).toEqual({ received: true });
    });

    it('should throw BadRequestException if signature is missing', async () => {
      const mockReq = { rawBody: Buffer.from('data') } as unknown as TWebhookRequest;
      await expect(controller.handleStripeWebhook('', mockReq)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if rawBody is missing', async () => {
      const mockReq = {} as unknown as TWebhookRequest;
      await expect(controller.handleStripeWebhook('sig_123', mockReq)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('getTransactions', () => {
    it('should return transactions for current user', async () => {
      const mockReq = { user: { id: 'user_1' } } as unknown as TAuthedRequest;
      const mockTx = [
        createMockTransaction({ id: 'tx_1' }),
        createMockTransaction({ id: 'tx_2', amount: 2000 }),
      ];
      service.getTransactionsByUserId.mockResolvedValue(mockTx);

      const result = await controller.getTransactions(mockReq);

      expect(service.getTransactionsByUserId).toHaveBeenCalledWith('user_1');
      expect(result).toEqual(mockTx);
    });
  });

  describe('downloadInvoice', () => {
    it('should trigger res.download with filepath from service', async () => {
      const mockReq = { user: { id: 'user_1' } } as unknown as TAuthedRequest;
      const mockRes = { download: jest.fn() } as unknown as TResponseMock;
      service.getInvoiceFilepath.mockResolvedValue('/abs/path/invoice.pdf');

      await controller.downloadInvoice(mockReq, 'tx_1', mockRes);

      expect(service.getInvoiceFilepath).toHaveBeenCalledWith('user_1', 'tx_1');
      expect(mockRes.download).toHaveBeenCalledWith('/abs/path/invoice.pdf', expect.any(Function));
    });

    it('should invoke download callback without error and not throw', async () => {
      const mockReq = { user: { id: 'user_1' } } as unknown as TAuthedRequest;
      const mockDownload = jest.fn((_path: string, cb: (err?: Error) => void) => cb(undefined));
      const mockRes = { download: mockDownload } as unknown as TResponseMock;
      service.getInvoiceFilepath.mockResolvedValue('/abs/path/invoice.pdf');

      await expect(controller.downloadInvoice(mockReq, 'tx_1', mockRes)).resolves.toBeUndefined();

      expect(mockDownload).toHaveBeenCalledWith('/abs/path/invoice.pdf', expect.any(Function));
    });

    it('should invoke download error handler without throwing', async () => {
      const mockReq = { user: { id: 'user_1' } } as unknown as TAuthedRequest;
      const mockDownload = jest.fn((_path: string, cb: (err?: Error) => void) =>
        cb(new Error('File missing')),
      );
      const mockRes = { download: mockDownload } as unknown as TResponseMock;
      service.getInvoiceFilepath.mockResolvedValue('/abs/path/invoice.pdf');

      await expect(controller.downloadInvoice(mockReq, 'tx_1', mockRes)).resolves.toBeUndefined();

      expect(mockDownload).toHaveBeenCalledWith('/abs/path/invoice.pdf', expect.any(Function));
    });
  });

  describe('cancelSubscription', () => {
    it('should cancel subscription for current user', async () => {
      const mockReq = { user: { id: 'user_1' } } as unknown as TAuthedRequest;
      service.cancelSubscription.mockResolvedValue(createMockSubscription({ plan: Plan.FREE }));

      const result = await controller.cancelSubscription(mockReq);

      expect(service.cancelSubscription).toHaveBeenCalledWith('user_1');
      expect(result).toEqual(expect.objectContaining({ plan: Plan.FREE }));
    });
  });
});
