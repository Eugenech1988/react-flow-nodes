import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { usePipelinesFilter } from './usePipelinesFilter';
import type { TSortOption } from '../model';
import type { TPipeline } from '@/entities';

const makePipeline = (overrides: Partial<TPipeline> = {}): TPipeline => ({
  id: 'p1',
  name: 'Alpha',
  description: 'desc',
  screenshotUrl: null,
  status: 'DRAFT',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  graphData: null,
  userId: 'u1',
  lastRunAt: null,
  lastRunStatus: null,
  ...overrides,
});

const makeThree = (): TPipeline[] => [
  makePipeline({ id: 'p1', name: 'Charlie', status: 'DRAFT', updatedAt: '2024-03-01T00:00:00Z' }),
  makePipeline({ id: 'p2', name: 'alpha', status: 'ACTIVE', updatedAt: '2024-01-01T00:00:00Z' }),
  makePipeline({ id: 'p3', name: 'Bravo', status: 'PAUSED', updatedAt: '2024-02-01T00:00:00Z' }),
];

describe('usePipelinesFilter', () => {
  describe('sorting by name', () => {
    it('sorts case-insensitively ascending', () => {
      const { result } = renderHook(() => usePipelinesFilter(makeThree(), 'name', 'asc'));
      expect(result.current.filteredPipelines.map((p) => p.id)).toEqual(['p2', 'p3', 'p1']);
    });

    it('sorts descending', () => {
      const { result } = renderHook(() => usePipelinesFilter(makeThree(), 'name', 'desc'));
      expect(result.current.filteredPipelines.map((p) => p.id)).toEqual(['p1', 'p3', 'p2']);
    });
  });

  describe('sorting by updatedAt', () => {
    it('sorts by date ascending', () => {
      const { result } = renderHook(() => usePipelinesFilter(makeThree(), 'updatedAt', 'asc'));
      expect(result.current.filteredPipelines.map((p) => p.id)).toEqual(['p2', 'p3', 'p1']);
    });

    it('sorts by date descending', () => {
      const { result } = renderHook(() => usePipelinesFilter(makeThree(), 'updatedAt', 'desc'));
      expect(result.current.filteredPipelines.map((p) => p.id)).toEqual(['p1', 'p3', 'p2']);
    });

    it('treats missing updatedAt as 0', () => {
      const pipelines = [
        makePipeline({ id: 'p1', updatedAt: '' }),
        makePipeline({ id: 'p2', updatedAt: '2024-01-01T00:00:00Z' }),
      ];
      const { result } = renderHook(() => usePipelinesFilter(pipelines, 'updatedAt', 'asc'));
      expect(result.current.filteredPipelines[0].id).toBe('p1');
    });
  });

  describe('sorting by status', () => {
    it('sorts by status string', () => {
      const { result } = renderHook(() => usePipelinesFilter(makeThree(), 'status', 'asc'));
      expect(result.current.filteredPipelines.map((p) => p.status)).toEqual([
        'ACTIVE',
        'DRAFT',
        'PAUSED',
      ]);
    });

    it('treats null status as empty string', () => {
      const pipelines = [
        makePipeline({ id: 'p1', status: null }),
        makePipeline({ id: 'p2', status: 'ACTIVE' }),
      ];
      const { result } = renderHook(() => usePipelinesFilter(pipelines, 'status', 'asc'));
      expect(result.current.filteredPipelines[0].id).toBe('p1');
    });
  });

  describe('search and status filter', () => {
    it('filters by search query (name)', () => {
      const { result } = renderHook(() => usePipelinesFilter(makeThree()));
      act(() => {
        result.current.handleSearchChange({
          target: { value: 'alp' },
        } as React.ChangeEvent<HTMLInputElement>);
      });
      expect(result.current.filteredPipelines.map((p) => p.id)).toEqual(['p2']);
    });

    it('filters by search query (description)', () => {
      const pipelines = [
        makePipeline({ id: 'p1', description: 'Unique text' }),
        makePipeline({ id: 'p2', description: 'Other' }),
      ];
      const { result } = renderHook(() => usePipelinesFilter(pipelines));
      act(() => {
        result.current.handleSearchChange({
          target: { value: 'unique' },
        } as React.ChangeEvent<HTMLInputElement>);
      });
      expect(result.current.filteredPipelines.map((p) => p.id)).toEqual(['p1']);
    });

    it('filters by status tab', () => {
      const { result } = renderHook(() => usePipelinesFilter(makeThree()));
      act(() => {
        result.current.setStatusFilter('ACTIVE');
      });
      expect(result.current.filteredPipelines.map((p) => p.id)).toEqual(['p2']);
    });

    it('keeps all statuses when statusFilter=all', () => {
      const { result } = renderHook(() => usePipelinesFilter(makeThree()));
      expect(result.current.filteredPipelines).toHaveLength(3);
    });
  });

  describe('exhaustiveness', () => {
    it('throws on unknown sortBy value', () => {
      const pipelines = makeThree();
      const invalid = 'unknown' as unknown as TSortOption['value'];
      expect(() => renderHook(() => usePipelinesFilter(pipelines, invalid, 'asc'))).toThrow(
        'Unhandled sortBy',
      );
    });

    it('does not throw for all valid sortBy values', () => {
      const pipelines = makeThree();
      const valid: TSortOption['value'][] = ['name', 'updatedAt', 'status'];
      valid.forEach((sortBy) => {
        expect(() =>
          renderHook(() => usePipelinesFilter(pipelines, sortBy, 'asc')),
        ).not.toThrow();
      });
    });
  });

  describe('defaults', () => {
    it('uses "name"/"asc" as defaults', () => {
      const { result } = renderHook(() => usePipelinesFilter(makeThree()));
      expect(result.current.sortBy).toBe('name');
      expect(result.current.sortOrder).toBe('asc');
      expect(result.current.statusFilter).toBe('all');
      expect(result.current.searchQuery).toBe('');
    });

    it('handles empty pipelines array', () => {
      const { result } = renderHook(() => usePipelinesFilter([]));
      expect(result.current.filteredPipelines).toEqual([]);
    });

    it('handles undefined pipelines (default param)', () => {
      const { result } = renderHook(() => usePipelinesFilter(undefined));
      expect(result.current.filteredPipelines).toEqual([]);
    });
  });

  describe('setters', () => {
    it('setSortBy and setSortOrder update state', () => {
      const { result } = renderHook(() => usePipelinesFilter(makeThree()));
      act(() => {
        result.current.setSortBy('status');
        result.current.setSortOrder('desc');
      });
      expect(result.current.sortBy).toBe('status');
      expect(result.current.sortOrder).toBe('desc');
    });
  });
});
