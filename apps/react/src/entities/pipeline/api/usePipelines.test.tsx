import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { ReactNode } from 'react';
import { usePipelines } from './usePipelines';
import type { TPipeline } from '../model';

const { mockQueryFn, mockUseUser } = vi.hoisted(() => ({
  mockQueryFn: vi.fn(),
  mockUseUser: vi.fn(),
}));

vi.mock('@/shared/hooks', () => ({
  useUser: () => mockUseUser(),
}));

vi.mock('@/shared/api', () => ({
  useTRPC: () => ({
    pipelines: {
      list: {
        queryOptions: () => ({
          queryKey: ['pipelines', 'list'],
          queryFn: mockQueryFn,
        }),
      },
    },
  }),
}));

const createWrapper = () => {
  const qc = new QueryClient({
    defaultOptions: {
      queries: { retry: false, staleTime: 0, gcTime: 0 },
    },
  });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  );
};

describe('usePipelines', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('query enabled state', () => {
    it('does not fetch when user is null', () => {
      mockUseUser.mockReturnValue({ user: null });
      mockQueryFn.mockResolvedValue([]);

      const { result } = renderHook(() => usePipelines(), {
        wrapper: createWrapper(),
      });

      expect(result.current.pipelines).toEqual([]);
      expect(result.current.hasPipelines).toBe(false);
      expect(result.current.isPending).toBe(true);
      expect(result.current.isLoading).toBe(false);
      expect(mockQueryFn).not.toHaveBeenCalled();
    });

    it('does not fetch when user.id is empty string', () => {
      mockUseUser.mockReturnValue({ user: { id: '' } });
      mockQueryFn.mockResolvedValue([]);

      renderHook(() => usePipelines(), { wrapper: createWrapper() });

      expect(mockQueryFn).not.toHaveBeenCalled();
    });

    it('fetches when user.id is present', async () => {
      mockUseUser.mockReturnValue({ user: { id: 'u1' } });
      mockQueryFn.mockResolvedValue([]);

      renderHook(() => usePipelines(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(mockQueryFn).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('data fallback (pipelines ?? [])', () => {
    it('returns empty array during initial loading (data is undefined)', () => {
      mockUseUser.mockReturnValue({ user: { id: 'u1' } });
      mockQueryFn.mockReturnValue(new Promise<TPipeline[]>(() => {}));

      const { result } = renderHook(() => usePipelines(), {
        wrapper: createWrapper(),
      });

      expect(result.current.pipelines).toEqual([]);
      expect(result.current.hasPipelines).toBe(false);
      expect(result.current.isLoading).toBe(true);
    });

    it('returns empty array when server responds with empty list', async () => {
      mockUseUser.mockReturnValue({ user: { id: 'u1' } });
      mockQueryFn.mockResolvedValue([]);

      const { result } = renderHook(() => usePipelines(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.pipelines).toEqual([]);
      expect(result.current.hasPipelines).toBe(false);
    });

    it('returns pipelines when server responds with items', async () => {
      const pipelines: TPipeline[] = [
        { id: 'p1', name: 'P1' } as TPipeline,
        { id: 'p2', name: 'P2' } as TPipeline,
      ];
      mockUseUser.mockReturnValue({ user: { id: 'u1' } });
      mockQueryFn.mockResolvedValue(pipelines);

      const { result } = renderHook(() => usePipelines(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.pipelines).toEqual(pipelines);
      expect(result.current.hasPipelines).toBe(true);
    });
  });

  describe('error handling', () => {
    it('exposes isError and error on failure', async () => {
      const error = new Error('network down');
      mockUseUser.mockReturnValue({ user: { id: 'u1' } });
      mockQueryFn.mockRejectedValue(error);

      const { result } = renderHook(() => usePipelines(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
      expect(result.current.pipelines).toEqual([]);
    });
  });

  describe('refetch', () => {
    it('exposes refetch as function', () => {
      mockUseUser.mockReturnValue({ user: { id: 'u1' } });
      mockQueryFn.mockResolvedValue([]);

      const { result } = renderHook(() => usePipelines(), {
        wrapper: createWrapper(),
      });

      expect(typeof result.current.refetch).toBe('function');
    });
  });
});
