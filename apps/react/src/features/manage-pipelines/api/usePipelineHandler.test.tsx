import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { TCreatePipelineInputData, TUpdatePipelineInputData } from '@pipeline/contracts';
import type { TPipeline } from '@/entities';
import { usePipelineHandler } from './usePipelineHandler';

interface IMutationCallbacks {
  mutationFn: (vars: unknown) => Promise<unknown>;
  onSuccess?: (data: unknown, vars: unknown) => void;
  onError?: (error: Error) => void;
}

interface IServiceMock {
  create: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
  remove: ReturnType<typeof vi.fn>;
  setCurrent: ReturnType<typeof vi.fn>;
}

interface IQueryClientMock {
  invalidateQueries: ReturnType<typeof vi.fn>;
  setQueryData: ReturnType<typeof vi.fn>;
}

const mocks = vi.hoisted<{ service: IServiceMock; queryClient: IQueryClientMock }>(() => ({
  service: {
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
    setCurrent: vi.fn(),
  },
  queryClient: {
    invalidateQueries: vi.fn(),
    setQueryData: vi.fn(),
  },
}));

vi.mock('./pipelineService', () => ({
  pipelineService: mocks.service,
}));

vi.mock('@tanstack/react-query', () => ({
  useMutation: (opts: IMutationCallbacks) => ({
    mutate: async (vars: unknown) => {
      try {
        const res = await opts.mutationFn(vars);
        opts.onSuccess?.(res, vars);
        return res;
      } catch (e) {
        opts.onError?.(e as Error);
        throw e;
      }
    },
    isPending: false,
  }),
  useQueryClient: () => mocks.queryClient,
}));

vi.mock('@/shared/api', () => ({
  useTRPC: () => ({
    pipelines: { list: { queryKey: () => ['pipelines'] } },
    auth: { me: { queryKey: () => ['auth'] } },
  }),
}));

const createData: TCreatePipelineInputData = { name: 'New' };

const updateData: TUpdatePipelineInputData = { id: 'p1', name: 'Updated' };

const makePipeline = (overrides: Partial<TPipeline> = {}): TPipeline =>
  ({
    id: 'p1',
    name: 'Pipeline',
    description: 'desc',
    status: 'ACTIVE',
    lastRunAt: '2024-01-01T00:00:00Z',
    lastRunStatus: 'SUCCESS',
    screenshotUrl: '/uploads/a.png',
    ...overrides,
  }) as TPipeline;

describe('usePipelineHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createPipeline', () => {
    it('delegates to pipelineService.create with data only', async () => {
      mocks.service.create.mockResolvedValue({ id: 'p1' });
      const onCreateSuccess = vi.fn();
      const { result } = renderHook(() => usePipelineHandler({ onCreateSuccess }));

      await act(async () => {
        await result.current.createPipeline.mutate({ data: createData });
      });

      expect(mocks.service.create).toHaveBeenCalledWith({ data: createData });
      expect(mocks.queryClient.invalidateQueries).toHaveBeenCalledWith({ queryKey: ['pipelines'] });
      expect(onCreateSuccess).toHaveBeenCalled();
    });

    it('delegates to pipelineService.create with file when provided', async () => {
      mocks.service.create.mockResolvedValue({ id: 'p1' });
      const { result } = renderHook(() => usePipelineHandler());
      const file = new File(['x'], 'cover.png', { type: 'image/png' });

      await act(async () => {
        await result.current.createPipeline.mutate({ data: createData, file });
      });

      expect(mocks.service.create).toHaveBeenCalledWith({ data: createData, file });
    });

    it('works without onCreateSuccess callback', async () => {
      mocks.service.create.mockResolvedValue({});
      const { result } = renderHook(() => usePipelineHandler());

      await act(async () => {
        await result.current.createPipeline.mutate({ data: createData });
      });

      expect(mocks.service.create).toHaveBeenCalled();
    });

    it('throws when service throws', async () => {
      mocks.service.create.mockRejectedValue(new Error('create failed'));
      const { result } = renderHook(() => usePipelineHandler());

      await expect(
        act(async () => {
          await result.current.createPipeline.mutate({ data: createData });
        }),
      ).rejects.toThrow('create failed');
    });
  });

  describe('updatePipeline', () => {
    it('delegates to pipelineService.update and invalidates caches', async () => {
      mocks.service.update.mockResolvedValue({});
      const onUpdateSuccess = vi.fn();
      const { result } = renderHook(() => usePipelineHandler({ onUpdateSuccess }));

      await act(async () => {
        await result.current.updatePipeline.mutate(updateData);
      });

      expect(mocks.service.update).toHaveBeenCalledWith(updateData);
      expect(mocks.queryClient.invalidateQueries).toHaveBeenCalledWith({ queryKey: ['pipelines'] });
      expect(mocks.queryClient.invalidateQueries).toHaveBeenCalledWith({ queryKey: ['auth'] });
      expect(onUpdateSuccess).toHaveBeenCalled();
    });

    it('throws when service throws', async () => {
      mocks.service.update.mockRejectedValue(new Error('update failed'));
      const { result } = renderHook(() => usePipelineHandler());

      await expect(
        act(async () => {
          await result.current.updatePipeline.mutate(updateData);
        }),
      ).rejects.toThrow('update failed');
    });
  });

  describe('deletePipeline', () => {
    it('delegates to pipelineService.remove and invalidates caches', async () => {
      mocks.service.remove.mockResolvedValue({});
      const { result } = renderHook(() => usePipelineHandler());

      await act(async () => {
        await result.current.deletePipeline.mutate('p1');
      });

      expect(mocks.service.remove).toHaveBeenCalledWith('p1');
      expect(mocks.queryClient.invalidateQueries).toHaveBeenCalledTimes(2);
    });
  });

  describe('setCurrentPipeline', () => {
    it('maps pipeline to setCurrent payload with lastRunStatus', async () => {
      mocks.service.setCurrent.mockResolvedValue({ id: 'u1' });
      const { result } = renderHook(() => usePipelineHandler());

      await act(async () => {
        await result.current.setCurrentPipeline.mutate(makePipeline());
      });

      expect(mocks.service.setCurrent).toHaveBeenCalledWith({
        id: 'p1',
        name: 'Pipeline',
        description: 'desc',
        status: 'ACTIVE',
        lastRunAt: '2024-01-01T00:00:00Z',
        lastRunStatus: 'SUCCESS',
        screenshotUrl: '/uploads/a.png',
      });
    });

    it('maps RUNNING and FAILED', async () => {
      mocks.service.setCurrent.mockResolvedValue({});
      const { result } = renderHook(() => usePipelineHandler());

      await act(async () => {
        await result.current.setCurrentPipeline.mutate(makePipeline({ lastRunStatus: 'RUNNING' }));
      });
      expect(mocks.service.setCurrent).toHaveBeenLastCalledWith(
        expect.objectContaining({ lastRunStatus: 'RUNNING' }),
      );

      await act(async () => {
        await result.current.setCurrentPipeline.mutate(makePipeline({ lastRunStatus: 'FAILED' }));
      });
      expect(mocks.service.setCurrent).toHaveBeenLastCalledWith(
        expect.objectContaining({ lastRunStatus: 'FAILED' }),
      );
    });

    it('maps unknown lastRunStatus to null', async () => {
      mocks.service.setCurrent.mockResolvedValue({});
      const { result } = renderHook(() => usePipelineHandler());

      await act(async () => {
        await result.current.setCurrentPipeline.mutate(makePipeline({ lastRunStatus: 'UNKNOWN' }));
      });

      expect(mocks.service.setCurrent).toHaveBeenCalledWith(
        expect.objectContaining({ lastRunStatus: null }),
      );
    });

    it('maps null lastRunStatus to null', async () => {
      mocks.service.setCurrent.mockResolvedValue({});
      const { result } = renderHook(() => usePipelineHandler());

      await act(async () => {
        await result.current.setCurrentPipeline.mutate(makePipeline({ lastRunStatus: null }));
      });

      expect(mocks.service.setCurrent).toHaveBeenCalledWith(
        expect.objectContaining({ lastRunStatus: null }),
      );
    });

    it('sets auth.me cache and calls onSetCurrentSuccess', async () => {
      const updatedUser = { id: 'u1', currentPipeline: { id: 'p1' } };
      mocks.service.setCurrent.mockResolvedValue(updatedUser);
      const onSetCurrentSuccess = vi.fn();
      const { result } = renderHook(() => usePipelineHandler({ onSetCurrentSuccess }));

      await act(async () => {
        await result.current.setCurrentPipeline.mutate(makePipeline());
      });

      expect(mocks.queryClient.setQueryData).toHaveBeenCalledWith(['auth'], updatedUser);
      expect(onSetCurrentSuccess).toHaveBeenCalled();
    });

    it('calls onSetCurrentError on failure', async () => {
      mocks.service.setCurrent.mockRejectedValue(new Error('network'));
      const onSetCurrentError = vi.fn();
      const { result } = renderHook(() => usePipelineHandler({ onSetCurrentError }));

      await expect(
        act(async () => {
          await result.current.setCurrentPipeline.mutate(makePipeline());
        }),
      ).rejects.toThrow('network');

      expect(onSetCurrentError).toHaveBeenCalledWith(expect.any(Error));
    });
  });
});
