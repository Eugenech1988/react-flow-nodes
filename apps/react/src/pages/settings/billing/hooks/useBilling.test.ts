import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useBilling } from './useBilling';

interface IMutationCallbacks {
  onMutate?: () => void;
  onSuccess?: (data: { url?: string } | undefined) => void;
  onError?: (error: Error) => void;
  mutationKey?: string;
}

interface IMutationResult {
  mutate: (vars?: unknown) => Promise<void>;
  isPending: boolean;
  reset: () => void;
}

const {
  mockCheckout,
  mockCancel,
  mockInvalidate,
  mockSearchParams,
  mockSetSearchParams,
  mockSubscription,
  mockTransactions,
} = vi.hoisted(() => ({
  mockCheckout: vi.fn<(vars?: unknown) => Promise<{ url?: string } | undefined>>(),
  mockCancel: vi.fn<(vars?: unknown) => Promise<unknown>>(),
  mockInvalidate: vi.fn<() => void>(),
  mockSearchParams: new URLSearchParams(),
  mockSetSearchParams: vi.fn<(params: URLSearchParams, opts: { replace: boolean }) => void>(),
  mockSubscription: { data: null as unknown, isLoading: false },
  mockTransactions: { data: [] as unknown[], isLoading: false },
}));

const originalLocation = window.location;

vi.mock('@tanstack/react-query', () => ({
  useMutation: (opts: IMutationCallbacks): IMutationResult => {
    const fn = opts.mutationKey === 'checkout' ? mockCheckout : mockCancel;
    return {
      mutate: async (vars?: unknown) => {
        opts.onMutate?.();
        try {
          const res = await fn(vars);
          opts.onSuccess?.(res as { url?: string } | undefined);
        } catch (e) {
          opts.onError?.(e as Error);
        }
      },
      isPending: false,
      reset: vi.fn(),
    };
  },
  useQueryClient: () => ({ invalidateQueries: mockInvalidate }),
}));

vi.mock('react-router-dom', () => ({
  useSearchParams: () => [mockSearchParams, mockSetSearchParams],
}));

vi.mock('@/shared/hooks', () => ({
  useSubscription: () => mockSubscription,
  useTransactions: () => mockTransactions,
}));

vi.mock('@/shared/api', () => ({
  useTRPC: () => ({
    billing: {
      checkout: {
        mutationOptions: (o: IMutationCallbacks) => ({ ...o, mutationKey: 'checkout' }),
      },
      cancel: {
        mutationOptions: (o: IMutationCallbacks) => ({ ...o, mutationKey: 'cancel' }),
      },
      subscription: { queryFilter: () => ({}) },
    },
    auth: { me: { queryFilter: () => ({}) } },
  }),
}));

describe('useBilling', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSearchParams.delete('success');
    mockSearchParams.delete('canceled');
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { href: '' },
    });
  });

  afterEach(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: originalLocation,
    });
  });

  describe('URL banner', () => {
    it('reads success param', () => {
      mockSearchParams.set('success', 'true');
      const { result } = renderHook(() => useBilling());
      expect(result.current.successMessage).toBe(
        'Payment successful! Your Pro plan is now active.',
      );
    });

    it('reads canceled param', () => {
      mockSearchParams.set('canceled', 'true');
      const { result } = renderHook(() => useBilling());
      expect(result.current.errorMessage).toBe('Payment was canceled.');
    });

    it('clears query params on mount', () => {
      mockSearchParams.set('success', 'true');
      renderHook(() => useBilling());
      expect(mockSetSearchParams).toHaveBeenCalledWith(expect.any(URLSearchParams), {
        replace: true,
      });
    });
  });

  describe('checkout', () => {
    it('redirects to stripe url on success', async () => {
      mockCheckout.mockResolvedValue({ url: 'https://stripe.com/session' });
      const { result } = renderHook(() => useBilling());

      await act(async () => {
        result.current.activateSubscription('yearly');
        await Promise.resolve();
      });

      expect(mockCheckout).toHaveBeenCalledWith({ plan: 'PRO', cycle: 'yearly' });
      expect(window.location.href).toBe('https://stripe.com/session');
    });

    it('sets error banner when no url returned', async () => {
      mockCheckout.mockResolvedValue({});
      const { result } = renderHook(() => useBilling());

      await act(async () => {
        result.current.activateSubscription('monthly');
        await Promise.resolve();
      });

      expect(result.current.errorMessage).toBe('Failed to retrieve payment link.');
    });

    it('sets error banner on checkout failure', async () => {
      mockCheckout.mockRejectedValue(new Error('Stripe error'));
      const { result } = renderHook(() => useBilling());

      await act(async () => {
        result.current.activateSubscription('monthly');
        await Promise.resolve();
      });

      expect(result.current.errorMessage).toBe('Stripe error');
    });

    it('defaults to monthly cycle', async () => {
      mockCheckout.mockResolvedValue({ url: 'https://stripe.com/x' });
      const { result } = renderHook(() => useBilling());

      await act(async () => {
        result.current.activateSubscription();
        await Promise.resolve();
      });

      expect(mockCheckout).toHaveBeenCalledWith({ plan: 'PRO', cycle: 'monthly' });
    });
  });

  describe('cancel', () => {
    it('invalidates caches and sets success banner', async () => {
      mockCancel.mockResolvedValue({});
      const { result } = renderHook(() => useBilling());

      await act(async () => {
        result.current.cancelSubscription();
        await Promise.resolve();
        await Promise.resolve();
      });

      expect(mockCancel).toHaveBeenCalled();
      expect(mockInvalidate).toHaveBeenCalledTimes(2);
      expect(result.current.successMessage).toBe('Subscription successfully canceled.');
    });

    it('sets error banner on cancel failure', async () => {
      mockCancel.mockRejectedValue(new Error('Cancel failed'));
      const { result } = renderHook(() => useBilling());

      await act(async () => {
        result.current.cancelSubscription();
        await Promise.resolve();
      });

      expect(result.current.errorMessage).toBe('Cancel failed');
    });
  });

  describe('dismiss', () => {
    it('dismissError clears error', () => {
      mockSearchParams.set('canceled', 'true');
      const { result } = renderHook(() => useBilling());
      expect(result.current.errorMessage).toBeTruthy();

      act(() => {
        result.current.dismissError();
      });

      expect(result.current.errorMessage).toBeNull();
    });

    it('dismissSuccess clears success', () => {
      mockSearchParams.set('success', 'true');
      const { result } = renderHook(() => useBilling());
      expect(result.current.successMessage).toBeTruthy();

      act(() => {
        result.current.dismissSuccess();
      });

      expect(result.current.successMessage).toBeNull();
    });
  });

  describe('openBillingPortal', () => {
    it('redirects to portal', () => {
      const { result } = renderHook(() => useBilling());
      result.current.openBillingPortal();
      expect(window.location.href).toContain('/billing/portal');
    });
  });
});
