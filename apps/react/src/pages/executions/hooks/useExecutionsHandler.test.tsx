import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useExecutionsHandler } from './useExecutionsHandler';

const { mockCreate, mockUpdate, mockRemove, mockInvalidate } = vi.hoisted(() => ({
  mockCreate: vi.fn(),
  mockUpdate: vi.fn(),
  mockRemove: vi.fn(),
  mockInvalidate: vi.fn(),
}));

vi.mock('@/shared/api', () => ({
  trpcClient: {
    executions: {
      create: { mutate: mockCreate },
      update: { mutate: mockUpdate },
      remove: { mutate: mockRemove },
    },
  },
  useTRPC: () => ({
    executions: {
      list: { queryKey: () => ['executions'] },
      getById: { queryKey: ({ id }: { id: string }) => ['executions', id] },
    },
  }),
}));

vi.mock('@tanstack/react-query', () => ({
  useMutation: (opts: unknown) => ({
    mutate: async (vars: unknown) => {
      try {
        const res = await opts.mutationFn(vars);
        opts.onSuccess?.(res, vars);
        return res;
      } catch (e) {
        opts.onError?.(e);
        throw e;
      }
    },
  }),
  useQueryClient: () => ({ invalidateQueries: mockInvalidate }),
}));

describe('useExecutionsHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('createExecution calls mutate and invalidates list', async () => {
    mockCreate.mockResolvedValue({});
    const onSuccess = vi.fn();
    const { result } = renderHook(() => useExecutionsHandler({ onCreateSuccess: onSuccess }));

    await result.current.createExecution.mutate({} as unknown as never);

    expect(mockCreate).toHaveBeenCalled();
    expect(mockInvalidate).toHaveBeenCalledWith({ queryKey: ['executions'] });
    expect(onSuccess).toHaveBeenCalled();
  });

  it('updateExecution invalidates list and getById', async () => {
    mockUpdate.mockResolvedValue({});
    const { result } = renderHook(() => useExecutionsHandler());

    await result.current.updateExecution.mutate({ id: 'e1', data: {} as unknown as never });

    expect(mockUpdate).toHaveBeenCalledWith({ id: 'e1', data: {} });
    expect(mockInvalidate).toHaveBeenCalledWith({ queryKey: ['executions'] });
    expect(mockInvalidate).toHaveBeenCalledWith({ queryKey: ['executions', 'e1'] });
  });

  it('deleteExecution calls mutate and invalidates', async () => {
    mockRemove.mockResolvedValue({});
    const onSuccess = vi.fn();
    const { result } = renderHook(() => useExecutionsHandler({ onDeleteSuccess: onSuccess }));

    await result.current.deleteExecution.mutate('e1');

    expect(mockRemove).toHaveBeenCalledWith({ id: 'e1' });
    expect(mockInvalidate).toHaveBeenCalledWith({ queryKey: ['executions'] });
    expect(onSuccess).toHaveBeenCalled();
  });
});

describe('useExecutionsHandler — error branches', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('createExecution calls onError when mutate fails', async () => {
    const error = new Error('create failed');
    mockCreate.mockRejectedValue(error);
    const { result } = renderHook(() => useExecutionsHandler());

    await expect(
      result.current.createExecution.mutate({} as unknown as never),
    ).rejects.toThrow('create failed');
  });

  it('updateExecution calls onError when mutate fails', async () => {
    mockUpdate.mockRejectedValue(new Error('update failed'));
    const { result } = renderHook(() => useExecutionsHandler());

    await expect(
      result.current.updateExecution.mutate({ id: 'e1', data: {} as unknown as never }),
    ).rejects.toThrow('update failed');
  });

  it('deleteExecution calls onError when mutate fails', async () => {
    mockRemove.mockRejectedValue(new Error('delete failed'));
    const { result } = renderHook(() => useExecutionsHandler());

    await expect(result.current.deleteExecution.mutate('e1')).rejects.toThrow('delete failed');
  });
});
