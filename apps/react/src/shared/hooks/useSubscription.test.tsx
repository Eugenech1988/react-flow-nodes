import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useSubscription } from './useSubscription';

const { mockUseQuery } = vi.hoisted(() => ({ mockUseQuery: vi.fn() }));

vi.mock('@tanstack/react-query', () => ({
  useQuery: (opts: unknown) => mockUseQuery(opts),
}));

vi.mock('@/shared/api', () => ({
  useTRPC: () => ({
    billing: { subscription: { queryOptions: () => ({ queryKey: ['sub'] }) } },
  }),
}));

describe('useSubscription', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns null when no data', () => {
    mockUseQuery.mockReturnValue({ data: null, isLoading: true });
    const { result } = renderHook(() => useSubscription());
    expect(result.current.subscription).toBeNull();
    expect(result.current.isProActive).toBe(false);
    expect(result.current.isLoading).toBe(true);
  });

  it('returns pro active when PRO + ACTIVE', () => {
    mockUseQuery.mockReturnValue({
      data: { plan: 'PRO', planStatus: 'ACTIVE' },
      isLoading: false,
    });
    const { result } = renderHook(() => useSubscription());
    expect(result.current.isProActive).toBe(true);
  });

  it('not pro when PRO + CANCELED', () => {
    mockUseQuery.mockReturnValue({
      data: { plan: 'PRO', planStatus: 'CANCELED' },
    });
    const { result } = renderHook(() => useSubscription());
    expect(result.current.isProActive).toBe(false);
  });

  it('not pro when FREE', () => {
    mockUseQuery.mockReturnValue({
      data: { plan: 'FREE', planStatus: 'ACTIVE' },
    });
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
