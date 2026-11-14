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
          data: { name: 'New' } as unknown as never,
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
          data: { name: 'P', description: 'desc' } as unknown as never,
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
        await result.current.createPipeline.mutate({ data: { name: 'X' } as unknown as never });
      });

      expect(onSuccess).toHaveBeenCalledTimes(1);
    });

    it('invalidates pipelines list after success', async () => {
      mockApiPost.mockResolvedValue({});
      const { result } = renderHook(() => usePipelineHandler());

      await act(async () => {
        await result.current.createPipeline.mutate({ data: { name: 'X' } as unknown as never });
      });

      expect(mockInvalidate).toHaveBeenCalledWith({ queryKey: ['pipelines'] });
    });
  });

  describe('updatePipeline', () => {
    it('throws when id is missing', async () => {
      const { result } = renderHook(() => usePipelineHandler());

      await expect(
        result.current.updatePipeline.mutate({ name: 'X' } as unknown as never)
      ).rejects.toThrow('Pipeline ID is required');
    });

    it('calls trpc update and invalidates both caches', async () => {
      mockTrpcUpdate.mockResolvedValue({});
      const { result } = renderHook(() => usePipelineHandler());

      await act(async () => {
        await result.current.updatePipeline.mutate({ id: 'p1', name: 'Updated' } as unknown as never);
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
        await result.current.updatePipeline.mutate({ id: 'p1' } as unknown as never);
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
        } as unknown as never);
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
        } as unknown as never);
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
        } as unknown as never);
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
        } as unknown as never);
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
        } as unknown as never);
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
        await result.current.setCurrentPipeline.mutate(pipelineBase as unknown as never);
      });

      expect(mockSetQueryData).toHaveBeenCalledWith(['auth'], updatedUser);
      expect(onSuccess).toHaveBeenCalledTimes(1);
    });
  });
});

describe('usePipelineHandler — final branches', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('createPipeline with file appends file to FormData', async () => {
    mockApiPost.mockResolvedValue({});
    const { result } = renderHook(() => usePipelineHandler());
    const file = new File(['x'], 'cover.png', { type: 'image/png' });

    await act(async () => {
      await result.current.createPipeline.mutate({
        data: { name: 'P', description: 'desc' } as unknown as never,
        file,
      });
    });

    const formData = mockApiPost.mock.calls[0][1] as FormData;
    expect(formData.get('file')).toBeInstanceOf(File);
    expect(formData.get('description')).toBe('desc');
  });

  it('createPipeline without description does not append description', async () => {
    mockApiPost.mockResolvedValue({});
    const { result } = renderHook(() => usePipelineHandler());

    await act(async () => {
      await result.current.createPipeline.mutate({ data: { name: 'P' } as unknown as never });
    });

    const formData = mockApiPost.mock.calls[0][1] as FormData;
    expect(formData.get('description')).toBeNull();
    expect(formData.get('file')).toBeNull();
  });

  it('createPipeline without onCreateSuccess does not crash', async () => {
    mockApiPost.mockResolvedValue({});
    const { result } = renderHook(() => usePipelineHandler());

    await expect(
      act(async () => {
        await result.current.createPipeline.mutate({ data: { name: 'P' } as unknown as never });
      }),
    ).resolves.not.toThrow();
  });

  it('updatePipeline calls trpc and invalidates caches', async () => {
    mockTrpcUpdate.mockResolvedValue({});
    const { result } = renderHook(() => usePipelineHandler());

    await act(async () => {
      await result.current.updatePipeline.mutate({ id: 'p1', name: 'Updated' } as unknown as never);
    });

    expect(mockTrpcUpdate).toHaveBeenCalledWith({ id: 'p1', name: 'Updated' });
    expect(mockInvalidate).toHaveBeenCalledTimes(2);
  });
});

describe('usePipelineHandler — error branches', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('createPipeline calls onError when api.post fails', async () => {
    mockApiPost.mockRejectedValue(new Error('create failed'));
    const { result } = renderHook(() => usePipelineHandler());

    await expect(
      result.current.createPipeline.mutate({ data: { name: 'X' } as unknown as never }),
    ).rejects.toThrow('create failed');
  });

  it('updatePipeline calls onError when mutate fails', async () => {
    mockTrpcUpdate.mockRejectedValue(new Error('update failed'));
    const { result } = renderHook(() => usePipelineHandler());

    await expect(
      result.current.updatePipeline.mutate({ id: 'p1' } as unknown as never),
    ).rejects.toThrow('update failed');
  });

  it('deletePipeline calls onError when mutate fails', async () => {
    mockTrpcRemove.mockRejectedValue(new Error('delete failed'));
    const { result } = renderHook(() => usePipelineHandler());

    await expect(result.current.deletePipeline.mutate('p1')).rejects.toThrow('delete failed');
  });

  it('setCurrentPipeline handles missing lastRunAt', async () => {
    mockTrpcSetCurrent.mockResolvedValue({});
    const { result } = renderHook(() => usePipelineHandler());

    await act(async () => {
      await result.current.setCurrentPipeline.mutate({
        id: 'p1',
        name: 'P1',
        description: null,
        status: null,
        lastRunAt: null,
        screenshotUrl: null,
      } as unknown as never);
    });

    expect(mockTrpcSetCurrent).toHaveBeenCalledWith(
      expect.objectContaining({ lastRunAt: null })
    );
  });
});
