import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useJobsTable } from './useJobsTable';
import type { IJob } from '../model/types';

vi.mock('../model', async () => {
  const actual = await vi.importActual<typeof import('../model')>('../model');
  return {
    ...actual,
    buildJobColumns: vi.fn(() => []),
  };
});

const makeJob = (id: string, overrides: Partial<IJob> = {}): IJob => ({
  id,
  slug: id,
  status: 'DRAFT',
  department: 'ENGINEERING',
  level: 'MID',
  type: 'FULL_TIME',
  location: 'Remote',
  icon: null,
  publishedAt: null,
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
  translations: [],
  ...overrides,
});

describe('useJobsTable', () => {
  it('paginates jobs', () => {
    const jobs = Array.from({ length: 25 }, (_, i) => makeJob(`j${i}`));
    const { result } = renderHook(() => useJobsTable({ jobs, onEdit: vi.fn() }));

    expect(result.current.totalPages).toBe(3);
    expect(result.current.paginatedJobs).toHaveLength(10);
  });

  it('changes page', () => {
    const jobs = Array.from({ length: 25 }, (_, i) => makeJob(`j${i}`));
    const { result } = renderHook(() => useJobsTable({ jobs, onEdit: vi.fn() }));

    act(() => result.current.setPage(2));
    expect(result.current.page).toBe(2);
  });

  it('resets page when limit grows beyond total', () => {
    const jobs = Array.from({ length: 15 }, (_, i) => makeJob(`j${i}`));
    const { result } = renderHook(() => useJobsTable({ jobs, onEdit: vi.fn() }));

    act(() => result.current.setPage(2));
    expect(result.current.page).toBe(2);

    act(() => result.current.setLimit(20));
    expect(result.current.page).toBe(1);
  });

  it('sorting toggles asc -> desc -> none', () => {
    const jobs = [makeJob('a'), makeJob('b')];
    const { result } = renderHook(() => useJobsTable({ jobs, onEdit: vi.fn() }));

    act(() => result.current.handleSort('slug'));
    expect(result.current.sorting).toEqual([{ id: 'slug', desc: false }]);

    act(() => result.current.handleSort('slug'));
    expect(result.current.sorting).toEqual([{ id: 'slug', desc: true }]);

    act(() => result.current.handleSort('slug'));
    expect(result.current.sorting).toEqual([]);
  });

  it('totalItems reflects jobs length', () => {
    const jobs = [makeJob('a'), makeJob('b')];
    const { result } = renderHook(() => useJobsTable({ jobs, onEdit: vi.fn() }));
    expect(result.current.totalItems).toBe(2);
  });
});
