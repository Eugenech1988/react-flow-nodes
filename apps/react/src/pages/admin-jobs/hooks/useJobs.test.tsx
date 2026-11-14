import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAdminJobs, useAdminJob, useJobMutations } from './useJobs';

interface IMutationOptions {
  m: string;
  onSuccess?: () => void;
}

interface IUseMutationResult {
  mutate: ReturnType<typeof vi.fn>;
  opts: IMutationOptions;
}

const mocks = vi.hoisted(() => ({
  useQuery: vi.fn(() => ({ data: undefined, isLoading: false })),
  useMutation: vi.fn((opts: IMutationOptions): IUseMutationResult => ({
    mutate: vi.fn(),
    opts,
  })),
  invalidate: vi.fn(),
}));

vi.mock('@tanstack/react-query', () => ({
  useQuery: (opts: unknown) => mocks.useQuery(opts),
  useMutation: (opts: IMutationOptions) => mocks.useMutation(opts),
  useQueryClient: () => ({ invalidateQueries: mocks.invalidate }),
}));

vi.mock('@/shared/api', () => ({
  useTRPC: () => ({
    jobs: {
      adminList: {
        queryOptions: () => ({ queryKey: ['adminList'] }),
        queryFilter: () => ({ queryKey: ['adminList'] }),
      },
      adminById: {
        queryOptions: (args: unknown) => ({ queryKey: ['adminById', args] }),
        queryFilter: () => ({ queryKey: ['adminById'] }),
      },
      create: { mutationOptions: () => ({ m: 'create' }) },
      update: { mutationOptions: () => ({ m: 'update' }) },
      upsertTranslation: { mutationOptions: () => ({ m: 'upsert' }) },
      removeTranslation: { mutationOptions: () => ({ m: 'removeTranslation' }) },
      publish: { mutationOptions: (opts: IMutationOptions) => ({ m: 'publish', ...opts }) },
      archive: { mutationOptions: (opts: IMutationOptions) => ({ m: 'archive', ...opts }) },
      remove: { mutationOptions: (opts: IMutationOptions) => ({ m: 'remove', ...opts }) },
    },
  }),
}));

describe('useJobs hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useAdminJobs', () => {
    it('calls useQuery with adminList options', () => {
      renderHook(() => useAdminJobs());
      expect(mocks.useQuery).toHaveBeenCalledWith({ queryKey: ['adminList'] });
    });
  });

  describe('useAdminJob', () => {
    it('enables query when id provided', () => {
      renderHook(() => useAdminJob('j1'));
      expect(mocks.useQuery).toHaveBeenCalledWith(expect.objectContaining({ enabled: true }));
    });

    it('disables query when id is null', () => {
      renderHook(() => useAdminJob(null));
      expect(mocks.useQuery).toHaveBeenCalledWith(expect.objectContaining({ enabled: false }));
    });
  });

  describe('useJobMutations', () => {
    it('returns all mutations', () => {
      const { result } = renderHook(() => useJobMutations());
      expect(result.current.createJob).toBeDefined();
      expect(result.current.updateJob).toBeDefined();
      expect(result.current.upsertTranslation).toBeDefined();
      expect(result.current.removeTranslation).toBeDefined();
      expect(result.current.publish).toBeDefined();
      expect(result.current.archive).toBeDefined();
      expect(result.current.remove).toBeDefined();
    });

    it('publish invalidates caches on success', () => {
      renderHook(() => useJobMutations());
      const publishCall = mocks.useMutation.mock.calls.find(([opts]) => opts?.m === 'publish');
      expect(publishCall).toBeDefined();
      publishCall![0].onSuccess?.();
      expect(mocks.invalidate).toHaveBeenCalledTimes(2);
    });

    it('archive invalidates caches on success', () => {
      renderHook(() => useJobMutations());
      const archiveCall = mocks.useMutation.mock.calls.find(([opts]) => opts?.m === 'archive');
      expect(archiveCall).toBeDefined();
      archiveCall![0].onSuccess?.();
      expect(mocks.invalidate).toHaveBeenCalledTimes(2);
    });

    it('remove invalidates caches on success', () => {
      renderHook(() => useJobMutations());
      const removeCall = mocks.useMutation.mock.calls.find(([opts]) => opts?.m === 'remove');
      expect(removeCall).toBeDefined();
      removeCall![0].onSuccess?.();
      expect(mocks.invalidate).toHaveBeenCalledTimes(2);
    });
  });
});
