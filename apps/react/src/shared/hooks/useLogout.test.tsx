import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useLogout } from './useLogout';

interface IMutationCallbacks {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

interface IMutationResult {
  mutate: () => void;
  isPending: boolean;
}

const {
  mockMutate,
  mockClear,
  mockNavigate,
  mockToastError,
  mockUseMutation,
} = vi.hoisted(() => ({
  mockMutate: vi.fn<() => void>(),
  mockClear: vi.fn<() => void>(),
  mockNavigate: vi.fn<(path: string, opts: { replace: boolean }) => void>(),
  mockToastError: vi.fn<(message: string) => void>(),
  mockUseMutation: vi.fn<(opts: IMutationCallbacks) => IMutationResult>(),
}));

vi.mock('@tanstack/react-query', () => ({
  useMutation: (opts: IMutationCallbacks) => mockUseMutation(opts),
  useQueryClient: () => ({ clear: mockClear }),
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock('sonner', () => ({
  toast: { error: mockToastError },
}));

vi.mock('@/shared/api', () => ({
  useTRPC: () => ({
    auth: {
      logout: { mutationOptions: () => ({}) },
    },
  }),
}));

describe('useLogout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseMutation.mockImplementation((opts: IMutationCallbacks) => ({
      mutate: () => {
        mockMutate();
        opts.onSuccess?.();
      },
      isPending: false,
    }));
  });

  it('returns mutate and pending flag', () => {
    const { result } = renderHook(() => useLogout());
    expect(typeof result.current.logout).toBe('function');
    expect(result.current.isLoggingOut).toBe(false);
  });

  it('on success clears cache and navigates to /login', () => {
    const { result } = renderHook(() => useLogout());

    act(() => {
      result.current.logout();
    });

    expect(mockMutate).toHaveBeenCalled();
    expect(mockClear).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/login', { replace: true });
  });

  it('on error shows toast', () => {
    mockUseMutation.mockImplementationOnce((opts: IMutationCallbacks) => ({
      mutate: () => {
        opts.onError?.(new Error('Logout failed'));
      },
      isPending: false,
    }));

    const { result } = renderHook(() => useLogout());

    act(() => {
      result.current.logout();
    });

    expect(mockToastError).toHaveBeenCalledWith('Logout failed');
    expect(mockClear).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('shows fallback message when error message is empty', () => {
    mockUseMutation.mockImplementationOnce((opts: IMutationCallbacks) => ({
      mutate: () => {
        opts.onError?.(new Error(''));
      },
      isPending: false,
    }));

    const { result } = renderHook(() => useLogout());

    act(() => {
      result.current.logout();
    });

    expect(mockToastError).toHaveBeenCalledWith(
      'Logout failed. Please try again or close the browser.',
    );
  });
});
