import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useTransactions } from './useTransactions';

const { mockUseQuery } = vi.hoisted(() => ({ mockUseQuery: vi.fn() }));

vi.mock('@tanstack/react-query', () => ({
  useQuery: (opts: unknown) => mockUseQuery(opts),
}));

vi.mock('@/shared/api', () => ({
  useTRPC: () => ({
    billing: { transactions: { queryOptions: () => ({ queryKey: ['tx'] }) } },
  }),
}));

describe('useTransactions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns empty array when no data', () => {
    mockUseQuery.mockReturnValue({ data: undefined });
    const { result } = renderHook(() => useTransactions());
    expect(result.current.transactions).toEqual([]);
    expect(result.current.hasTransactions).toBe(false);
  });

  it('returns empty array for null data', () => {
    mockUseQuery.mockReturnValue({ data: null });
    const { result } = renderHook(() => useTransactions());
    expect(result.current.transactions).toEqual([]);
  });

  it('returns empty array for empty transactions', () => {
    mockUseQuery.mockReturnValue({ data: [] });
    const { result } = renderHook(() => useTransactions());
    expect(result.current.transactions).toEqual([]);
    expect(result.current.hasTransactions).toBe(false);
  });

  it('returns transactions and hasTransactions true', () => {
    const tx = [{ id: 't1' }, { id: 't2' }];
    mockUseQuery.mockReturnValue({ data: tx });
    const { result } = renderHook(() => useTransactions());
    expect(result.current.transactions).toEqual(tx);
    expect(result.current.hasTransactions).toBe(true);
  });
});
