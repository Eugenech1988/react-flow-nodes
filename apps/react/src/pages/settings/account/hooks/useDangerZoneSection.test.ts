import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useDangerZoneSection } from './useDangerZoneSection';

const { mockMutate, mockClear, mockNavigate } = vi.hoisted(() => ({
  mockMutate: vi.fn(),
  mockClear: vi.fn(),
  mockNavigate: vi.fn(),
}));

vi.mock('@tanstack/react-query', () => ({
  useMutation: (opts: unknown) => ({
    mutate: () => {
      mockMutate();
      opts.onSuccess?.();
    },
    isPending: false,
  }),
  useQueryClient: () => ({ clear: mockClear }),
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock('@/shared/api', () => ({
  useTRPC: () => ({
    users: { remove: { mutationOptions: (o: unknown) => o } },
  }),
}));

describe('useDangerZoneSection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('confirm clears cache and navigates', () => {
    const { result } = renderHook(() => useDangerZoneSection());

    act(() => {
      result.current.confirm();
    });

    expect(mockMutate).toHaveBeenCalled();
    expect(mockClear).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/login', { replace: true });
  });

  it('open and close toggle modal', () => {
    const { result } = renderHook(() => useDangerZoneSection());

    act(() => result.current.open());
    expect(result.current.isOpen).toBe(true);

    act(() => result.current.close());
    expect(result.current.isOpen).toBe(false);
  });
});
