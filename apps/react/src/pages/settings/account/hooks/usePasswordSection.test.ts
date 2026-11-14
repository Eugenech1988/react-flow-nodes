import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { usePasswordSection } from './usePasswordSection';

const { mockMutate, mockInvalidate, mockUseUser, mockFormReset } = vi.hoisted(() => ({
  mockMutate: vi.fn(),
  mockInvalidate: vi.fn(),
  mockUseUser: vi.fn(),
  mockFormReset: vi.fn(),
}));

vi.mock('react-hook-form', () => ({
  useForm: () => ({
    register: vi.fn(),
    handleSubmit: (fn: (data: unknown) => unknown) => fn,
    reset: mockFormReset,
    formState: { isDirty: true, errors: {} },
  }),
}));

vi.mock('@hookform/resolvers/zod', () => ({
  zodResolver: () => vi.fn(),
}));

vi.mock('@tanstack/react-query', () => ({
  useMutation: (opts: unknown) => ({
    mutate: (vars: unknown) => {
      mockMutate(vars);
      opts.onSuccess?.({ success: true });
    },
    isPending: false,
  }),
  useQueryClient: () => ({ invalidateQueries: mockInvalidate }),
}));

vi.mock('@/shared/api', () => ({
  useTRPC: () => ({
    users: { updatePassword: { mutationOptions: (o: unknown) => o } },
    auth: { me: { queryFilter: () => ({}) } },
  }),
}));

vi.mock('@/shared/hooks', () => ({
  useUser: () => mockUseUser(),
}));

describe('usePasswordSection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseUser.mockReturnValue({ user: { hasPassword: true } });
  });

  it('hasPassword is true', () => {
    const { result } = renderHook(() => usePasswordSection());
    expect(result.current.hasPassword).toBe(true);
  });

  it('hasPassword is false when user has no password', () => {
    mockUseUser.mockReturnValue({ user: { hasPassword: false } });
    const { result } = renderHook(() => usePasswordSection());
    expect(result.current.hasPassword).toBe(false);
  });

  it('submits password change and sets success alert', async () => {
    const { result } = renderHook(() => usePasswordSection());

    await act(async () => {
      await result.current.onSubmit({
        currentPassword: 'old',
        newPassword: 'new123',
        confirmPassword: 'new123',
      });
    });

    expect(mockMutate).toHaveBeenCalledWith({
      currentPassword: 'old',
      newPassword: 'new123',
    });
    expect(mockInvalidate).toHaveBeenCalled();
    expect(mockFormReset).toHaveBeenCalled();
    expect(result.current.alert).toEqual({
      type: 'success',
      message: 'Password updated successfully.',
    });
  });
});
