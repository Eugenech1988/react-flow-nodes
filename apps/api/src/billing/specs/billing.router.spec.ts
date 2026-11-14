import { createBillingRouter } from '../billing.router';
import type { BillingService } from '../billing.service';
import type { TrpcContext } from '@/trpc/context';
import { Plan } from '@prisma/client';

describe('Billing Router', () => {
  let mockBillingService: jest.Mocked<BillingService>;
  let router: ReturnType<typeof createBillingRouter>;

  type TMockUser = NonNullable<TrpcContext['user']>;

  const mockUser = {
    id: 'user_1',
    email: 'test@example.com',
    role: 'USER',
  } as unknown as TMockUser;

  const createMockContext = (user: TMockUser | null): TrpcContext => ({
    user,
    req: {} as TrpcContext['req'],
    res: {} as TrpcContext['res'],
  });

  beforeEach(() => {
    mockBillingService = {
      getSubscriptionByUserId: jest.fn(),
      getTransactionsByUserId: jest.fn(),
      createCheckoutSession: jest.fn(),
      cancelSubscription: jest.fn(),
      createBillingPortalSession: jest.fn(),
    } as unknown as jest.Mocked<BillingService>;

    router = createBillingRouter(mockBillingService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Access control', () => {
    it('should throw UNAUTHORIZED when user is missing', async () => {
      const caller = router.createCaller(createMockContext(null));

      await expect(caller.subscription()).rejects.toMatchObject({ code: 'UNAUTHORIZED' });
      await expect(caller.transactions()).rejects.toMatchObject({ code: 'UNAUTHORIZED' });
      await expect(caller.checkout({ plan: 'PRO', cycle: 'monthly' })).rejects.toMatchObject({
        code: 'UNAUTHORIZED',
      });
      await expect(caller.cancel()).rejects.toMatchObject({ code: 'UNAUTHORIZED' });
    });
  });

  describe('subscription', () => {
    it('should return subscription for current user', async () => {
      mockBillingService.getSubscriptionByUserId.mockResolvedValue({
        plan: Plan.PRO,
      } as never);

      const caller = router.createCaller(createMockContext(mockUser));
      const result = await caller.subscription();

      expect(mockBillingService.getSubscriptionByUserId).toHaveBeenCalledWith('user_1');
      expect(result).toEqual({ plan: Plan.PRO });
    });
  });

  describe('transactions', () => {
    it('should return transactions for current user', async () => {
      const mockTx = [{ id: 'tx_1' }];
      mockBillingService.getTransactionsByUserId.mockResolvedValue(mockTx as never);

      const caller = router.createCaller(createMockContext(mockUser));
      const result = await caller.transactions();

      expect(mockBillingService.getTransactionsByUserId).toHaveBeenCalledWith('user_1');
      expect(result).toEqual(mockTx);
    });
  });

  describe('checkout', () => {
    it('should call createCheckoutSession with user id, plan and monthly cycle', async () => {
      mockBillingService.createCheckoutSession.mockResolvedValue({
        url: 'https://stripe.com/session',
      });

      const caller = router.createCaller(createMockContext(mockUser));
      const result = await caller.checkout({ plan: 'PRO', cycle: 'monthly' });

      expect(mockBillingService.createCheckoutSession).toHaveBeenCalledWith(
        'user_1',
        'PRO',
        'monthly',
      );
      expect(result).toEqual({ url: 'https://stripe.com/session' });
    });

    it('should call createCheckoutSession with yearly cycle', async () => {
      mockBillingService.createCheckoutSession.mockResolvedValue({
        url: 'https://stripe.com/session-yearly',
      });

      const caller = router.createCaller(createMockContext(mockUser));
      const result = await caller.checkout({ plan: 'PRO', cycle: 'yearly' });

      expect(mockBillingService.createCheckoutSession).toHaveBeenCalledWith(
        'user_1',
        'PRO',
        'yearly',
      );
      expect(result).toEqual({ url: 'https://stripe.com/session-yearly' });
    });

    it('should reject invalid plan', async () => {
      const caller = router.createCaller(createMockContext(mockUser));

      await expect(
        caller.checkout({ plan: 'FREE', cycle: 'monthly' } as never),
      ).rejects.toMatchObject({ code: 'BAD_REQUEST' });
    });

    it('should reject invalid cycle', async () => {
      const caller = router.createCaller(createMockContext(mockUser));

      await expect(
        caller.checkout({ plan: 'PRO', cycle: 'weekly' } as never),
      ).rejects.toMatchObject({ code: 'BAD_REQUEST' });
    });
  });

  describe('cancel', () => {
    it('should call cancelSubscription with user id', async () => {
      mockBillingService.cancelSubscription.mockResolvedValue({
        plan: Plan.FREE,
      } as never);

      const caller = router.createCaller(createMockContext(mockUser));
      const result = await caller.cancel();

      expect(mockBillingService.cancelSubscription).toHaveBeenCalledWith('user_1');
      expect(result).toEqual({ plan: Plan.FREE });
    });
  });
});
