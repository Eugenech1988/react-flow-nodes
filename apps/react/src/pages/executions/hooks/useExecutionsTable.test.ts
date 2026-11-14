import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useExecutionsTable } from './useExecutionsTable';

const { mockUseExecutions, mockUseUser } = vi.hoisted(() => ({
  mockUseExecutions: vi.fn(),
  mockUseUser: vi.fn(),
}));

vi.mock('./useExecutions', () => ({
  useExecutions: (opts: unknown) => mockUseExecutions(opts),
}));

vi.mock('@/shared/hooks', () => ({
  useUser: () => mockUseUser(),
}));

describe('useExecutionsTable', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseUser.mockReturnValue({ user: { currentPipelineId: 'p1' } });
    mockUseExecutions.mockReturnValue({
      executions: [],
      totalRuns: 0,
      totalPages: 1,
      isLoading: false,
      isFetching: false,
      refetch: vi.fn(),
    });
  });

  it('passes pipelineId from user', () => {
    renderHook(() => useExecutionsTable());
    expect(mockUseExecutions).toHaveBeenCalledWith(
      expect.objectContaining({ pipelineId: 'p1' })
    );
  });

  it('resets page on search change', () => {
    const { result } = renderHook(() => useExecutionsTable());

    act(() => result.current.setPage(3));
    expect(result.current.page).toBe(3);

    act(() =>
      result.current.handleSearchChange({
        target: { value: 'abc' },
      } as unknown as never)
    );
    expect(result.current.page).toBe(1);
    expect(result.current.searchQuery).toBe('abc');
  });

  it('resets page on tab change', () => {
    const { result } = renderHook(() => useExecutionsTable());

    act(() => result.current.setPage(3));
    act(() => result.current.handleTabChange('failed'));

    expect(result.current.page).toBe(1);
    expect(result.current.statusFilter).toBe('failed');
  });

  it('changes limit', () => {
    const { result } = renderHook(() => useExecutionsTable());
    act(() => result.current.setLimit(50));
    expect(result.current.limit).toBe(50);
  });

  it('sets selected execution', () => {
    const { result } = renderHook(() => useExecutionsTable());
    const exec = { id: 'e1', pipelineName: 'P', status: 'success' } as unknown as never;
    act(() => result.current.setSelectedExec(exec));
    expect(result.current.selectedExec).toBe(exec);
  });

  it('handles user without pipeline', () => {
    mockUseUser.mockReturnValue({ user: null });
    renderHook(() => useExecutionsTable());
    expect(mockUseExecutions).toHaveBeenCalledWith(
      expect.objectContaining({ pipelineId: undefined })
    );
  });
});
