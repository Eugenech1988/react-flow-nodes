import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { Plan, TransactionStatus } from '@prisma/client';
import type { Subscription, Transaction } from '@prisma/client';
import { BillingController } from '@/billing/billing.controller';
import { BillingService } from '@/billing/billing.service';

type MockReq = Parameters<BillingController['getSubscription']>[0];
type MockRes = Parameters<BillingController['downloadInvoice']>[2];
type MockWebhookReq = Parameters<BillingController['handleStripeWebhook']>[1];

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
    const mockBillingService = {
      createCheckoutSession: jest.fn(),
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
    it('should call billingService.createCheckoutSession', async () => {
      const mockReq = { user: { id: 'user_1' } } as unknown as MockReq;
      service.createCheckoutSession.mockResolvedValue({ url: 'http://stripe.com' });

      const res = await controller.createCheckout(mockReq, { plan: Plan.PRO });

      expect(service.createCheckoutSession).toHaveBeenCalledWith('user_1', Plan.PRO);
      expect(res).toEqual({ url: 'http://stripe.com' });
    });
  });

  describe('getSubscription', () => {
    it('should return subscription for current user', async () => {
      const mockReq = { user: { id: 'user_1' } } as unknown as MockReq;
      service.getSubscriptionByUserId.mockResolvedValue(createMockSubscription({ plan: Plan.PRO }));

      const result = await controller.getSubscription(mockReq);

      expect(service.getSubscriptionByUserId).toHaveBeenCalledWith('user_1');
      expect(result).toEqual(expect.objectContaining({ plan: Plan.PRO }));
    });
  });

  describe('handleStripeWebhook', () => {
    it('should call handleWebhook with signature and raw body', async () => {
      const mockReq = { rawBody: Buffer.from('raw_body_data') } as unknown as MockWebhookReq;
      service.handleWebhook.mockResolvedValue({ received: true });

      const res = await controller.handleStripeWebhook('sig_123', mockReq);

      expect(service.handleWebhook).toHaveBeenCalledWith('sig_123', mockReq.rawBody);
      expect(res).toEqual({ received: true });
    });

    it('should throw BadRequestException if signature is missing', async () => {
      const mockReq = { rawBody: Buffer.from('data') } as unknown as MockWebhookReq;
      await expect(controller.handleStripeWebhook('', mockReq)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if rawBody is missing', async () => {
      const mockReq = {} as unknown as MockWebhookReq;
      await expect(controller.handleStripeWebhook('sig_123', mockReq)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('getTransactions', () => {
    it('should return transactions for current user', async () => {
      const mockReq = { user: { id: 'user_1' } } as unknown as MockReq;
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

  describe('createCheckout - user fallback', () => {
    it('should fallback to temp-user-id when req.user is missing', async () => {
      const mockReq = {} as unknown as MockReq;
      service.createCheckoutSession.mockResolvedValue({ url: 'https://stripe.com' });

      await controller.createCheckout(mockReq, { plan: Plan.PRO });

      expect(service.createCheckoutSession).toHaveBeenCalledWith('temp-user-id', Plan.PRO);
    });
  });

  describe('downloadInvoice - error callback', () => {
    it('should invoke download callback without error and not throw', async () => {
      const mockReq = { user: { id: 'user_1' } } as unknown as MockReq;
      const mockDownload = jest.fn((_path: string, cb: (err?: Error) => void) => cb(undefined));
      const mockRes = { download: mockDownload } as unknown as MockRes;
      service.getInvoiceFilepath.mockResolvedValue('/abs/path/invoice.pdf');

      await expect(controller.downloadInvoice(mockReq, 'tx_1', mockRes)).resolves.toBeUndefined();

      expect(mockDownload).toHaveBeenCalledWith('/abs/path/invoice.pdf', expect.any(Function));
    });

    it('should invoke download error handler without throwing', async () => {
      const mockReq = { user: { id: 'user_1' } } as unknown as MockReq;
      const mockDownload = jest.fn((_path: string, cb: (err?: Error) => void) =>
        cb(new Error('File missing')),
      );
      const mockRes = { download: mockDownload } as unknown as MockRes;
      service.getInvoiceFilepath.mockResolvedValue('/abs/path/invoice.pdf');

      await expect(controller.downloadInvoice(mockReq, 'tx_1', mockRes)).resolves.toBeUndefined();

      expect(mockDownload).toHaveBeenCalledWith('/abs/path/invoice.pdf', expect.any(Function));
    });
  });

  describe('downloadInvoice', () => {
    it('should trigger res.download with filepath from service', async () => {
      const mockReq = { user: { id: 'user_1' } } as unknown as MockReq;
      const mockRes = { download: jest.fn() } as unknown as MockRes;
      service.getInvoiceFilepath.mockResolvedValue('/abs/path/invoice.pdf');

      await controller.downloadInvoice(mockReq, 'tx_1', mockRes);

      expect(service.getInvoiceFilepath).toHaveBeenCalledWith('user_1', 'tx_1');
      expect(mockRes.download).toHaveBeenCalledWith('/abs/path/invoice.pdf', expect.any(Function));
    });

    it('should invoke download error handler without throwing', async () => {
      const mockReq = { user: { id: 'user_1' } } as unknown as MockReq;
      const mockDownload = jest.fn((_path: string, cb: (err?: Error) => void) =>
        cb(new Error('File missing')),
      );
      const mockRes = { download: mockDownload } as unknown as MockRes;
      service.getInvoiceFilepath.mockResolvedValue('/abs/path/invoice.pdf');

      await expect(controller.downloadInvoice(mockReq, 'tx_1', mockRes)).resolves.toBeUndefined();

      expect(mockDownload).toHaveBeenCalledWith('/abs/path/invoice.pdf', expect.any(Function));
    });
  });

  describe('cancelSubscription', () => {
    it('should cancel subscription for current user', async () => {
      const mockReq = { user: { id: 'user_1' } } as unknown as MockReq;
      service.cancelSubscription.mockResolvedValue(createMockSubscription({ plan: Plan.FREE }));

      const result = await controller.cancelSubscription(mockReq);

      expect(service.cancelSubscription).toHaveBeenCalledWith('user_1');
      expect(result).toEqual(expect.objectContaining({ plan: Plan.FREE }));
    });
  });
});
