import { describe, it, expect, vi, beforeEach } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

const { mockNavigate, mockClearStorage, mockResetGraph, mockLogoutMutation, mockToastError } =
  vi.hoisted(() => ({
    mockNavigate: vi.fn(),
    mockClearStorage: vi.fn(),
    mockResetGraph: vi.fn(),
    mockLogoutMutation: vi.fn<() => Promise<void>>(),
    mockToastError: vi.fn(),
  }));

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock('@/shared/api', async () => {
  const actual = await vi.importActual<typeof import('@/shared/api')>('@/shared/api');
  return {
    ...actual,
    useTRPC: () => ({
      auth: {
        logout: {
          mutationOptions: () => ({ mutationFn: mockLogoutMutation }),
        },
      },
    }),
  };
});

vi.mock('@/entities', () => ({
  useStore: {
    persist: { clearStorage: mockClearStorage },
    getState: () => ({ resetGraph: mockResetGraph }),
  },
}));

vi.mock('sonner', () => ({
  toast: { error: mockToastError },
}));

import { useLogout } from './useLogout';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useLogout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns logout and isLoggingOut', () => {
    const { result } = renderHook(() => useLogout(), { wrapper: createWrapper() });

    expect(typeof result.current.logout).toBe('function');
    expect(typeof result.current.isLoggingOut).toBe('boolean');
  });

  it('clears cache, persist storage, resets graph and navigates on success', async () => {
    mockLogoutMutation.mockResolvedValueOnce(undefined);
    const { result } = renderHook(() => useLogout(), { wrapper: createWrapper() });

    act(() => {
      result.current.logout();
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login', { replace: true });
    });

    expect(mockLogoutMutation).toHaveBeenCalledTimes(1);
    expect(mockClearStorage).toHaveBeenCalledTimes(1);
    expect(mockResetGraph).toHaveBeenCalledTimes(1);
  });

  it('does not clear storage or navigate on error', async () => {
    mockLogoutMutation.mockRejectedValueOnce(new Error('boom'));
    const { result } = renderHook(() => useLogout(), { wrapper: createWrapper() });

    act(() => {
      result.current.logout();
    });

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith('boom');
    });

    expect(mockNavigate).not.toHaveBeenCalled();
    expect(mockClearStorage).not.toHaveBeenCalled();
    expect(mockResetGraph).not.toHaveBeenCalled();
  });

  it('shows default error message when error has no message', async () => {
    mockLogoutMutation.mockRejectedValueOnce(new Error(''));
    const { result } = renderHook(() => useLogout(), { wrapper: createWrapper() });

    act(() => {
      result.current.logout();
    });

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith(
        'Logout failed. Please try again or close the browser.',
      );
    });
  });

  it('exposes isLoggingOut=true while pending', async () => {
    let resolveLogout: () => void = () => {};
    mockLogoutMutation.mockReturnValueOnce(
      new Promise<void>((resolve) => {
        resolveLogout = resolve;
      }),
    );

    const { result } = renderHook(() => useLogout(), { wrapper: createWrapper() });

    act(() => {
      result.current.logout();
    });

    await waitFor(() => {
      expect(result.current.isLoggingOut).toBe(true);
    });

    act(() => {
      resolveLogout();
    });

    await waitFor(() => {
      expect(result.current.isLoggingOut).toBe(false);
    });
  });
});