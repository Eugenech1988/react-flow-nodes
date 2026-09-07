import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { Plan } from '@prisma/client';
import { BillingController } from '@/billing/billing.controller';
import { BillingService } from '@/billing/billing.service';

describe('BillingController', () => {
  let controller: BillingController;
  let service: any;

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
    service = module.get<BillingService>(BillingService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createCheckout', () => {
    it('should call billingService.createCheckoutSession', async () => {
      const mockReq = { user: { id: 'user_1' } } as any;
      service.createCheckoutSession.mockResolvedValue({ url: 'http://stripe.com' });

      const res = await controller.createCheckout(mockReq, { plan: Plan.PRO });

      expect(service.createCheckoutSession).toHaveBeenCalledWith('user_1', Plan.PRO);
      expect(res).toEqual({ url: 'http://stripe.com' });
    });
  });

  describe('handleStripeWebhook', () => {
    it('should call handleWebhook with signature and raw body', async () => {
      const mockReq = { rawBody: Buffer.from('raw_body_data') } as any;
      service.handleWebhook.mockResolvedValue({ received: true });

      const res = await controller.handleStripeWebhook('sig_123', mockReq);

      expect(service.handleWebhook).toHaveBeenCalledWith('sig_123', mockReq.rawBody);
      expect(res).toEqual({ received: true });
    });

    it('should throw BadRequestException if signature is missing', async () => {
      const mockReq = { rawBody: Buffer.from('data') } as any;
      await expect(controller.handleStripeWebhook('', mockReq)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if rawBody is missing', async () => {
      const mockReq = {} as any;
      await expect(controller.handleStripeWebhook('sig_123', mockReq)).rejects.toThrow(BadRequestException);
    });
  });

  describe('downloadInvoice', () => {
    it('should trigger res.download with filepath from service', async () => {
      const mockReq = { user: { id: 'user_1' } } as any;
      const mockRes = { download: jest.fn() } as any;
      service.getInvoiceFilepath.mockResolvedValue('/abs/path/invoice.pdf');

      await controller.downloadInvoice(mockReq, 'tx_1', mockRes);

      expect(service.getInvoiceFilepath).toHaveBeenCalledWith('user_1', 'tx_1');
      expect(mockRes.download).toHaveBeenCalledWith('/abs/path/invoice.pdf', expect.any(Function));
    });
  });
});