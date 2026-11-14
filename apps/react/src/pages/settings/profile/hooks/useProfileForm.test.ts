import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useProfileForm } from './useProfileForm';

const { mockMutateAsync, mockInvalidate, mockUseUser } = vi.hoisted(() => ({
  mockMutateAsync: vi.fn(),
  mockInvalidate: vi.fn(),
  mockUseUser: vi.fn(),
}));

vi.mock('@tanstack/react-query', () => ({
  useMutation: (opts: unknown) => ({
    mutateAsync: async (vars: unknown) => {
      try {
        const res = await mockMutateAsync(vars);
        opts.onSuccess?.(res);
        return res;
      } catch (e) {
        opts.onError?.(e);
        return undefined;
      }
    },
    isPending: false,
  }),
  useQueryClient: () => ({ invalidateQueries: mockInvalidate }),
}));

vi.mock('@/shared/api', () => ({
  useTRPC: () => ({
    profile: { update: { mutationOptions: (o: unknown) => o } },
    auth: { me: { queryFilter: () => ({}) } },
  }),
}));

vi.mock('@/shared/hooks', () => ({
  useUser: () => mockUseUser(),
}));

describe('useProfileForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseUser.mockReturnValue({
      user: {
        profile: {
          firstName: 'John',
          lastName: 'Doe',
          company: 'Acme',
          location: 'NY',
          jobTitle: 'Dev',
        },
      },
    });
  });

  it('initializes form with user data', () => {
    const { result } = renderHook(() => useProfileForm());
    expect(result.current.form.getValues()).toEqual({
      firstName: 'John',
      lastName: 'Doe',
      company: 'Acme',
      location: 'NY',
      jobTitle: 'Dev',
    });
  });

  it('submits form and sets success alert', async () => {
    mockMutateAsync.mockResolvedValue({
      profile: {
        firstName: 'Jane',
        lastName: 'Smith',
        company: 'Acme',
        location: 'NY',
        jobTitle: 'Dev',
      },
    });
    const { result } = renderHook(() => useProfileForm());

    await act(async () => {
      await result.current.form.handleSubmit(result.current.onSubmit)();
    });

    expect(mockMutateAsync).toHaveBeenCalledWith({
      firstName: 'John',
      lastName: 'Doe',
      company: 'Acme',
      location: 'NY',
      jobTitle: 'Dev',
    });
    expect(mockInvalidate).toHaveBeenCalled();
    expect(result.current.alert).toEqual({
      type: 'success',
      message: 'Profile updated successfully.',
    });
  });

  it('sets error alert on failure', async () => {
    mockMutateAsync.mockRejectedValue(new Error('Save failed'));
    const { result } = renderHook(() => useProfileForm());

    await act(async () => {
      await result.current.form.handleSubmit(result.current.onSubmit)();
    });

    expect(result.current.alert).toEqual({
      type: 'error',
      message: 'Save failed',
    });
  });
});
