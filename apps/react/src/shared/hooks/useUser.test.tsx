import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useUser } from './useUser';

const mockUseQuery = vi.fn();
const mockUseTRPC = vi.fn(() => ({
  auth: { me: { queryOptions: () => ({ queryKey: ['auth', 'me'] }) } },
}));

vi.mock('@tanstack/react-query', () => ({
  useQuery: (opts: unknown) => mockUseQuery(opts),
}));

vi.mock('@/shared/api', () => ({
  useTRPC: () => mockUseTRPC(),
}));

describe('useUser', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns nulls when no user', () => {
    mockUseQuery.mockReturnValue({
      data: null,
      isLoading: false,
      isError: false,
      error: null,
    });

    const { result } = renderHook(() => useUser());

    expect(result.current.user).toBeNull();
    expect(result.current.isAuth).toBe(false);
    expect(result.current.role).toBeNull();
    expect(result.current.isProActive).toBe(false);
  });

  it('returns user when loaded', () => {
    const user = {
      id: 'u1',
      email: 'a@b.com',
      role: 'USER',
      subscription: { plan: 'FREE', planStatus: 'ACTIVE' },
    };

    mockUseQuery.mockReturnValue({
      data: user,
      isLoading: false,
      isError: false,
      error: null,
    });

    const { result } = renderHook(() => useUser());

    expect(result.current.user).toEqual(user);
    expect(result.current.isAuth).toBe(true);
    expect(result.current.role).toBe('USER');
    expect(result.current.isProActive).toBe(false);
  });

  it('isProActive when plan PRO and ACTIVE', () => {
    mockUseQuery.mockReturnValue({
      data: { id: 'u1', role: 'USER', subscription: { plan: 'PRO', planStatus: 'ACTIVE' } },
    });

    const { result } = renderHook(() => useUser());

    expect(result.current.isProActive).toBe(true);
  });

  it('isProActive false when plan PRO but not ACTIVE', () => {
    mockUseQuery.mockReturnValue({
      data: { id: 'u1', role: 'USER', subscription: { plan: 'PRO', planStatus: 'CANCELED' } },
    });

    const { result } = renderHook(() => useUser());

    expect(result.current.isProActive).toBe(false);
  });

  it('isProActive false when no subscription', () => {
    mockUseQuery.mockReturnValue({
      data: { id: 'u1', role: 'USER', subscription: null },
    });

    const { result } = renderHook(() => useUser());

    expect(result.current.isProActive).toBe(false);
  });

  it('exposes error and isLoading', () => {
    mockUseQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: true,
      error: new Error('boom'),
    });

    const { result } = renderHook(() => useUser());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.isError).toBe(true);
    expect(result.current.error).toEqual(new Error('boom'));
  });
});