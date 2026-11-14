import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useDangerZoneSection } from './useDangerZoneSection';

interface IMutationOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

const mocks = vi.hoisted(() => ({
  mutate: vi.fn<() => void>(),
  clear: vi.fn<() => void>(),
  navigate: vi.fn<(path: string, opts?: { replace?: boolean }) => void>(),
  isPending: { value: false },
}));

vi.mock('@tanstack/react-query', () => ({
  useMutation: (opts: IMutationOptions) => ({
    mutate: () => {
      try {
        mocks.mutate();
        opts.onSuccess?.();
      } catch (e) {
        opts.onError?.(e as Error);
      }
    },
    isPending: mocks.isPending.value,
  }),
  useQueryClient: () => ({ clear: mocks.clear }),
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => mocks.navigate,
}));

vi.mock('@/shared/api', () => ({
  useTRPC: () => ({
    users: { remove: { mutationOptions: (o: IMutationOptions) => o } },
  }),
}));

describe('useDangerZoneSection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.isPending.value = false;
  });

  it('confirm clears cache, closes modal, and navigates on success', () => {
    const { result } = renderHook(() => useDangerZoneSection());

    act(() => {
      result.current.open();
      result.current.confirm();
    });

    expect(mocks.mutate).toHaveBeenCalled();
    expect(mocks.clear).toHaveBeenCalled();
    expect(mocks.navigate).toHaveBeenCalledWith('/login', { replace: true });
    expect(result.current.isOpen).toBe(false);
  });

  it('keeps modal open and sets error alert on failure', () => {
    mocks.mutate.mockImplementationOnce(() => {
      throw new Error('nope');
    });

    const { result } = renderHook(() => useDangerZoneSection());

    act(() => {
      result.current.open();
      result.current.confirm();
    });

    expect(result.current.isOpen).toBe(true);
    expect(result.current.alert).toEqual({ type: 'error', message: 'nope' });
    expect(mocks.clear).not.toHaveBeenCalled();
    expect(mocks.navigate).not.toHaveBeenCalled();
  });

  it('uses fallback message when error has no message', () => {
    mocks.mutate.mockImplementationOnce(() => {
      throw new Error('');
    });

    const { result } = renderHook(() => useDangerZoneSection());

    act(() => {
      result.current.open();
      result.current.confirm();
    });

    expect(result.current.alert).toEqual({
      type: 'error',
      message: 'Failed to delete account.',
    });
    expect(result.current.isOpen).toBe(true);
  });

  it('exposes isPending from mutation', () => {
    mocks.isPending.value = true;
    const { result } = renderHook(() => useDangerZoneSection());
    expect(result.current.isPending).toBe(true);
  });

  it('open and close toggle modal', () => {
    const { result } = renderHook(() => useDangerZoneSection());

    act(() => result.current.open());
    expect(result.current.isOpen).toBe(true);

    act(() => result.current.close());
    expect(result.current.isOpen).toBe(false);
  });

  it('confirm clears previous alert before new attempt', () => {
    mocks.mutate.mockImplementationOnce(() => {
      throw new Error('first');
    });
    const { result } = renderHook(() => useDangerZoneSection());

    act(() => {
      result.current.confirm();
    });
    expect(result.current.alert).not.toBeNull();

    mocks.mutate.mockImplementationOnce(() => {});
    act(() => {
      result.current.confirm();
    });
    expect(result.current.alert).toBeNull();
  });
});
