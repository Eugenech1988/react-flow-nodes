import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useSubscription } from './useSubscription';
import { useUser } from './useUser';

const mockUseQuery = vi.fn();

vi.mock('@tanstack/react-query', () => ({
  useQuery: (opts: unknown) => mockUseQuery(opts),
}));

vi.mock('@/shared/api', () => ({
  useTRPC: () => ({
    billing: { subscription: { queryOptions: () => ({ queryKey: ['sub'] }) } },
  }),
}));

vi.mock('./useUser', () => ({
  useUser: vi.fn(),
}));

const mockUseUser = vi.mocked(useUser);

describe('useSubscription', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseUser.mockReturnValue({ isProActive: false } as ReturnType<typeof useUser>);
  });

  it('returns null subscription when no data', () => {
    mockUseQuery.mockReturnValue({ data: null, isLoading: true });
    const { result } = renderHook(() => useSubscription());
    expect(result.current.subscription).toBeNull();
  });

  it('delegates isProActive to useUser (single source of truth)', () => {
    mockUseUser.mockReturnValue({ isProActive: true } as ReturnType<typeof useUser>);
    mockUseQuery.mockReturnValue({ data: { plan: 'PRO', planStatus: 'ACTIVE' } });
    const { result } = renderHook(() => useSubscription());
    expect(result.current.isProActive).toBe(true);
  });

  it('ignores subscription.plan for isProActive', () => {
    mockUseUser.mockReturnValue({ isProActive: false } as ReturnType<typeof useUser>);
    mockUseQuery.mockReturnValue({ data: { plan: 'PRO', planStatus: 'ACTIVE' } });
    const { result } = renderHook(() => useSubscription());
    expect(result.current.isProActive).toBe(false);
  });

  it('exposes error and refetch', () => {
    const refetch = vi.fn();
    mockUseQuery.mockReturnValue({
      data: null,
      isError: true,
      error: new Error('x'),
      refetch,
    });
    const { result } = renderHook(() => useSubscription());
    expect(result.current.isError).toBe(true);
    expect(result.current.error).toEqual(new Error('x'));
    expect(result.current.refetch).toBe(refetch);
  });
});
