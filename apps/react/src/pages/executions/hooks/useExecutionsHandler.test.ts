import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useExecutionsHandler } from './useExecutionsHandler';
import type { TCreateExecutionInputData, TUpdateExecutionInputData } from '@pipeline/contracts';

interface IHandlerMocks {
  create: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
  remove: ReturnType<typeof vi.fn>;
  invalidate: ReturnType<typeof vi.fn>;
}

const mocks = vi.hoisted<IHandlerMocks>(() => ({
  create: vi.fn(),
  update: vi.fn(),
  remove: vi.fn(),
  invalidate: vi.fn(),
}));

vi.mock('@/shared/api', () => ({
  trpcClient: {
    executions: {
      create: { mutate: mocks.create },
      update: { mutate: mocks.update },
      remove: { mutate: mocks.remove },
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
  useMutation: (opts: {
    mutationFn: (vars: unknown) => Promise<unknown>;
    onSuccess?: (data: unknown, vars: unknown) => void;
    onError?: (error: unknown) => void;
  }) => ({
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
  useQueryClient: () => ({ invalidateQueries: mocks.invalidate }),
}));

const createPayload: TCreateExecutionInputData = {
  pipelineId: 'p1',
  userId: 'u1',
  status: 'RUNNING',
  triggeredBy: 'MANUAL',
  nodesExecuted: 0,
  logs: {},
};

const updatePayload: TUpdateExecutionInputData = {
  status: 'SUCCESS',
  finishedAt: '2024-01-01',
  durationMs: 100,
  nodesExecuted: 1,
  logs: {},
};

describe('useExecutionsHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createExecution', () => {
    it('calls mutate and invalidates list', async () => {
      mocks.create.mockResolvedValue({});
      const onSuccess = vi.fn();
      const { result } = renderHook(() => useExecutionsHandler({ onCreateSuccess: onSuccess }));

      await result.current.createExecution.mutate(createPayload);

      expect(mocks.create).toHaveBeenCalledWith(createPayload);
      expect(mocks.invalidate).toHaveBeenCalledWith({ queryKey: ['executions'] });
      expect(onSuccess).toHaveBeenCalled();
    });

    it('works without onCreateSuccess', async () => {
      mocks.create.mockResolvedValue({});
      const { result } = renderHook(() => useExecutionsHandler());

      await result.current.createExecution.mutate(createPayload);

      expect(mocks.create).toHaveBeenCalled();
    });

    it('throws on error', async () => {
      mocks.create.mockRejectedValue(new Error('create failed'));
      const { result } = renderHook(() => useExecutionsHandler());

      await expect(result.current.createExecution.mutate(createPayload)).rejects.toThrow(
        'create failed',
      );
    });
  });

  describe('updateExecution', () => {
    it('invalidates list and getById', async () => {
      mocks.update.mockResolvedValue({});
      const onSuccess = vi.fn();
      const { result } = renderHook(() => useExecutionsHandler({ onUpdateSuccess: onSuccess }));

      await result.current.updateExecution.mutate({ id: 'e1', data: updatePayload });

      expect(mocks.update).toHaveBeenCalledWith({ id: 'e1', data: updatePayload });
      expect(mocks.invalidate).toHaveBeenCalledWith({ queryKey: ['executions'] });
      expect(mocks.invalidate).toHaveBeenCalledWith({ queryKey: ['executions', 'e1'] });
      expect(onSuccess).toHaveBeenCalled();
    });

    it('works without onUpdateSuccess', async () => {
      mocks.update.mockResolvedValue({});
      const { result } = renderHook(() => useExecutionsHandler());

      await result.current.updateExecution.mutate({ id: 'e1', data: updatePayload });

      expect(mocks.update).toHaveBeenCalled();
    });

    it('throws on error', async () => {
      mocks.update.mockRejectedValue(new Error('update failed'));
      const { result } = renderHook(() => useExecutionsHandler());

      await expect(
        result.current.updateExecution.mutate({ id: 'e1', data: updatePayload }),
      ).rejects.toThrow('update failed');
    });
  });

  describe('deleteExecution', () => {
    it('calls remove and invalidates', async () => {
      mocks.remove.mockResolvedValue({});
      const onSuccess = vi.fn();
      const { result } = renderHook(() => useExecutionsHandler({ onDeleteSuccess: onSuccess }));

      await result.current.deleteExecution.mutate('e1');

      expect(mocks.remove).toHaveBeenCalledWith({ id: 'e1' });
      expect(mocks.invalidate).toHaveBeenCalledWith({ queryKey: ['executions'] });
      expect(onSuccess).toHaveBeenCalled();
    });

    it('works without onDeleteSuccess', async () => {
      mocks.remove.mockResolvedValue({});
      const { result } = renderHook(() => useExecutionsHandler());

      await result.current.deleteExecution.mutate('e1');

      expect(mocks.remove).toHaveBeenCalled();
    });

    it('throws on error', async () => {
      mocks.remove.mockRejectedValue(new Error('delete failed'));
      const { result } = renderHook(() => useExecutionsHandler());

      await expect(result.current.deleteExecution.mutate('e1')).rejects.toThrow('delete failed');
    });
  });
});
