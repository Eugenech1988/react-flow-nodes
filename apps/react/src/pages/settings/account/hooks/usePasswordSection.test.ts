import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { usePasswordSection } from './usePasswordSection';

type PasswordValues = {
  currentPassword?: string;
  newPassword: string;
  confirmPassword: string;
};

const { mockMutate, mockInvalidate, mockUseUser, mockFormReset } = vi.hoisted(() => ({
  mockMutate: vi.fn(),
  mockInvalidate: vi.fn(),
  mockUseUser: vi.fn(),
  mockFormReset: vi.fn(),
}));

vi.mock('react-hook-form', () => {
  let currentValues: Record<string, unknown> = {};
  return {
    useForm: () => ({
      register: vi.fn(),
      handleSubmit:
        (fn: (data: Record<string, unknown>) => unknown) => (data: Record<string, unknown>) => {
          currentValues = data;
          return fn(data);
        },
      reset: mockFormReset,
      formState: { isDirty: true, errors: {} },
      watch: (key?: string) => (key === undefined ? currentValues : currentValues[key]),
      getValues: (key?: string) => (key === undefined ? currentValues : currentValues[key]),
    }),
  };
});

vi.mock('@hookform/resolvers/zod', () => ({
  zodResolver: () => vi.fn(),
}));

vi.mock('@tanstack/react-query', () => ({
  useMutation: (opts: {
    onSuccess?: (data: { success: boolean }) => void;
    onError?: (e: unknown) => void;
  }) => ({
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
      const submit = result.current.onSubmit as unknown as (data: PasswordValues) => Promise<void>;

      await submit({
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
