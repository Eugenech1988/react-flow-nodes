import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { usePipelineHandler } from './usePipelineHandler';

const {
  mockApiPost,
  mockTrpcUpdate,
  mockTrpcRemove,
  mockTrpcSetCurrent,
  mockInvalidate,
  mockSetQueryData,
} = vi.hoisted(() => ({
  mockApiPost: vi.fn(),
  mockTrpcUpdate: vi.fn(),
  mockTrpcRemove: vi.fn(),
  mockTrpcSetCurrent: vi.fn(),
  mockInvalidate: vi.fn(),
  mockSetQueryData: vi.fn(),
}));

vi.mock('@/shared/api', () => ({
  api: { post: mockApiPost },
  trpcClient: {
    pipelines: {
      update: { mutate: mockTrpcUpdate },
      remove: { mutate: mockTrpcRemove },
    },
    users: {
      setCurrentPipeline: { mutate: mockTrpcSetCurrent },
    },
  },
  useTRPC: () => ({
    pipelines: { list: { queryKey: () => ['pipelines'] } },
    auth: { me: { queryKey: () => ['auth'] } },
  }),
}));

vi.mock('@tanstack/react-query', () => ({
  useMutation: (opts: any) => ({
    mutate: async (vars: any) => {
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
  useQueryClient: () => ({
    invalidateQueries: mockInvalidate,
    setQueryData: mockSetQueryData,
  }),
}));

describe('usePipelineHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createPipeline', () => {
    it('builds FormData with name only', async () => {
      mockApiPost.mockResolvedValue({});
      const { result } = renderHook(() => usePipelineHandler());

      await act(async () => {
        await result.current.createPipeline.mutate({
          data: { name: 'New' } as any,
        });
      });

      const formData = mockApiPost.mock.calls[0][1] as FormData;
      expect(formData.get('name')).toBe('New');
      expect(formData.get('description')).toBeNull();
      expect(formData.get('file')).toBeNull();
    });

    it('includes description and file when provided', async () => {
      mockApiPost.mockResolvedValue({});
      const { result } = renderHook(() => usePipelineHandler());
      const file = new File(['x'], 'cover.png', { type: 'image/png' });

      await act(async () => {
        await result.current.createPipeline.mutate({
          data: { name: 'P', description: 'desc' } as any,
          file,
        });
      });

      const formData = mockApiPost.mock.calls[0][1] as FormData;
      expect(formData.get('name')).toBe('P');
      expect(formData.get('description')).toBe('desc');
      expect(formData.get('file')).toBeInstanceOf(File);
    });

    it('calls onCreateSuccess after success', async () => {
      mockApiPost.mockResolvedValue({});
      const onSuccess = vi.fn();
      const { result } = renderHook(() => usePipelineHandler({ onCreateSuccess: onSuccess }));

      await act(async () => {
        await result.current.createPipeline.mutate({ data: { name: 'X' } as any });
      });

      expect(onSuccess).toHaveBeenCalledTimes(1);
    });

    it('invalidates pipelines list after success', async () => {
      mockApiPost.mockResolvedValue({});
      const { result } = renderHook(() => usePipelineHandler());

      await act(async () => {
        await result.current.createPipeline.mutate({ data: { name: 'X' } as any });
      });

      expect(mockInvalidate).toHaveBeenCalledWith({ queryKey: ['pipelines'] });
    });
  });

  describe('updatePipeline', () => {
    it('throws when id is missing', async () => {
      const { result } = renderHook(() => usePipelineHandler());

      await expect(
        result.current.updatePipeline.mutate({ name: 'X' } as any)
      ).rejects.toThrow('Pipeline ID is required');
    });

    it('calls trpc update and invalidates both caches', async () => {
      mockTrpcUpdate.mockResolvedValue({});
      const { result } = renderHook(() => usePipelineHandler());

      await act(async () => {
        await result.current.updatePipeline.mutate({ id: 'p1', name: 'Updated' } as any);
      });

      expect(mockTrpcUpdate).toHaveBeenCalledWith({ id: 'p1', name: 'Updated' });
      expect(mockInvalidate).toHaveBeenCalledWith({ queryKey: ['pipelines'] });
      expect(mockInvalidate).toHaveBeenCalledWith({ queryKey: ['auth'] });
    });

    it('calls onUpdateSuccess after success', async () => {
      mockTrpcUpdate.mockResolvedValue({});
      const onSuccess = vi.fn();
      const { result } = renderHook(() => usePipelineHandler({ onUpdateSuccess: onSuccess }));

      await act(async () => {
        await result.current.updatePipeline.mutate({ id: 'p1' } as any);
      });

      expect(onSuccess).toHaveBeenCalledTimes(1);
    });
  });

  describe('deletePipeline', () => {
    it('calls trpc remove', async () => {
      mockTrpcRemove.mockResolvedValue({});
      const { result } = renderHook(() => usePipelineHandler());

      await act(async () => {
        await result.current.deletePipeline.mutate('p1');
      });

      expect(mockTrpcRemove).toHaveBeenCalledWith({ id: 'p1' });
    });

    it('invalidates both caches after success', async () => {
      mockTrpcRemove.mockResolvedValue({});
      const { result } = renderHook(() => usePipelineHandler());

      await act(async () => {
        await result.current.deletePipeline.mutate('p1');
      });

      expect(mockInvalidate).toHaveBeenCalledTimes(2);
    });
  });

  describe('setCurrentPipeline', () => {
    const pipelineBase = {
      id: 'p1',
      name: 'P1',
      description: 'Desc',
      status: 'ACTIVE',
      lastRunAt: null,
      screenshotUrl: null,
    };

    it('maps SUCCESS lastRunStatus', async () => {
      mockTrpcSetCurrent.mockResolvedValue({});
      const { result } = renderHook(() => usePipelineHandler());

      await act(async () => {
        await result.current.setCurrentPipeline.mutate({
          ...pipelineBase,
          lastRunStatus: 'SUCCESS',
        } as any);
      });

      expect(mockTrpcSetCurrent).toHaveBeenCalledWith(
        expect.objectContaining({ lastRunStatus: 'SUCCESS' })
      );
    });

    it('maps FAILED lastRunStatus', async () => {
      mockTrpcSetCurrent.mockResolvedValue({});
      const { result } = renderHook(() => usePipelineHandler());

      await act(async () => {
        await result.current.setCurrentPipeline.mutate({
          ...pipelineBase,
          lastRunStatus: 'FAILED',
        } as any);
      });

      expect(mockTrpcSetCurrent).toHaveBeenCalledWith(
        expect.objectContaining({ lastRunStatus: 'FAILED' })
      );
    });

    it('maps RUNNING lastRunStatus', async () => {
      mockTrpcSetCurrent.mockResolvedValue({});
      const { result } = renderHook(() => usePipelineHandler());

      await act(async () => {
        await result.current.setCurrentPipeline.mutate({
          ...pipelineBase,
          lastRunStatus: 'RUNNING',
        } as any);
      });

      expect(mockTrpcSetCurrent).toHaveBeenCalledWith(
        expect.objectContaining({ lastRunStatus: 'RUNNING' })
      );
    });

    it('maps invalid lastRunStatus to null', async () => {
      mockTrpcSetCurrent.mockResolvedValue({});
      const { result } = renderHook(() => usePipelineHandler());

      await act(async () => {
        await result.current.setCurrentPipeline.mutate({
          ...pipelineBase,
          lastRunStatus: 'UNKNOWN',
        } as any);
      });

      expect(mockTrpcSetCurrent).toHaveBeenCalledWith(
        expect.objectContaining({ lastRunStatus: null })
      );
    });

    it('maps null lastRunStatus to null', async () => {
      mockTrpcSetCurrent.mockResolvedValue({});
      const { result } = renderHook(() => usePipelineHandler());

      await act(async () => {
        await result.current.setCurrentPipeline.mutate({
          ...pipelineBase,
          lastRunStatus: null,
        } as any);
      });

      expect(mockTrpcSetCurrent).toHaveBeenCalledWith(
        expect.objectContaining({ lastRunStatus: null })
      );
    });

    it('updates auth.me cache and calls onSetCurrentSuccess', async () => {
      const updatedUser = { id: 'u1', currentPipeline: { id: 'p1' } };
      mockTrpcSetCurrent.mockResolvedValue(updatedUser);
      const onSuccess = vi.fn();
      const { result } = renderHook(() => usePipelineHandler({ onSetCurrentSuccess: onSuccess }));

      await act(async () => {
        await result.current.setCurrentPipeline.mutate(pipelineBase as any);
      });

      expect(mockSetQueryData).toHaveBeenCalledWith(['auth'], updatedUser);
      expect(onSuccess).toHaveBeenCalledTimes(1);
    });
  });
});
