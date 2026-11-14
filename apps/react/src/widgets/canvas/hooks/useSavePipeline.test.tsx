import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const {
  mockStore,
  mockMutateAsync,
  mockToastSuccess,
  mockToastError,
  mockFitView,
  mockToPng,
  mockUseUser,
  mockUsePipelineHandler,
} = vi.hoisted(() => ({
  mockStore: {
    nodes: [],
    edges: [],
    lastRunAt: null,
    lastRunStatus: null,
    saveStatus: 'saved' as 'saved' | 'saving' | 'unsaved' | 'error',
    setSaveAction: vi.fn(),
    setSaveStatus: vi.fn(),
  },
  mockMutateAsync: vi.fn(),
  mockToastSuccess: vi.fn(),
  mockToastError: vi.fn(),
  mockFitView: vi.fn(),
  mockToPng: vi.fn(),
  mockUseUser: vi.fn(),
  mockUsePipelineHandler: vi.fn(),
}));

vi.mock('@xyflow/react', () => ({
  useReactFlow: () => ({ fitView: mockFitView }),
}));

vi.mock('html-to-image', () => ({
  toPng: mockToPng,
}));

vi.mock('sonner', () => ({
  toast: { success: mockToastSuccess, error: mockToastError },
}));

vi.mock('@/entities', () => {
  const useStoreMock = (selector: (s: typeof mockStore) => unknown) => selector(mockStore);
  return {
    useStore: Object.assign(useStoreMock, {
      getState: () => mockStore,
    }),
  };
});

vi.mock('@/features/manage-pipelines', () => ({
  usePipelineHandler: () => mockUsePipelineHandler(),
}));

vi.mock('@/shared/hooks', () => ({
  useUser: () => mockUseUser(),
}));

import { useSavePipeline } from './useSavePipeline';

const makeWrapperRef = (viewportExists = true) => ({
  current: {
    querySelector: vi.fn((sel: string) =>
      viewportExists && sel === '.react-flow__viewport'
        ? ({ tagName: 'DIV' } as unknown as HTMLElement)
        : null,
    ),
  } as unknown as HTMLDivElement,
});

describe('useSavePipeline', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();

    mockStore.nodes = [{ id: 'n1', type: 'text', position: { x: 0, y: 0 }, data: {} }];
    mockStore.edges = [];
    mockStore.lastRunAt = null;
    mockStore.lastRunStatus = null;
    mockStore.saveStatus = 'saved';

    mockUseUser.mockReturnValue({
      user: { currentPipelineId: 'p1' },
    });

    mockUsePipelineHandler.mockReturnValue({
      updatePipeline: { mutateAsync: mockMutateAsync },
    });

    mockMutateAsync.mockResolvedValue({});
    mockFitView.mockResolvedValue(undefined);
    mockToPng.mockResolvedValue('data:image/png;base64,screenshot');
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('saveAction registration', () => {
    it('registers saveAction on mount', () => {
      renderHook(() => useSavePipeline({ wrapperRef: makeWrapperRef() }));

      expect(mockStore.setSaveAction).toHaveBeenCalledWith(expect.any(Function));
    });

    it('unregisters saveAction on unmount', () => {
      const { unmount } = renderHook(() =>
        useSavePipeline({ wrapperRef: makeWrapperRef() }),
      );

      unmount();

      expect(mockStore.setSaveAction).toHaveBeenLastCalledWith(null);
    });
  });

  describe('handleSavePipeline — without screenshot', () => {
    it('calls updatePipeline with graph data', async () => {
      const { result } = renderHook(() =>
        useSavePipeline({ wrapperRef: makeWrapperRef() }),
      );

      await act(async () => {
        await result.current.handleSavePipeline(false);
      });

      expect(mockMutateAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'p1',
          graphData: expect.objectContaining({
            nodes: mockStore.nodes,
            edges: mockStore.edges,
          }),
        }),
      );
      expect(mockStore.setSaveStatus).toHaveBeenCalledWith('saving');
      expect(mockStore.setSaveStatus).toHaveBeenCalledWith('saved');
      expect(mockFitView).not.toHaveBeenCalled();
      expect(mockToPng).not.toHaveBeenCalled();
    });

    it('returns early if no pipeline id', async () => {
      mockUseUser.mockReturnValue({ user: null });

      const { result } = renderHook(() =>
        useSavePipeline({ wrapperRef: makeWrapperRef() }),
      );

      await act(async () => {
        await result.current.handleSavePipeline(false);
      });

      expect(mockMutateAsync).not.toHaveBeenCalled();
      expect(mockStore.setSaveStatus).not.toHaveBeenCalled();
    });

    it('includes lastRunAt and lastRunStatus when present', async () => {
      mockStore.lastRunAt = '2024-01-01T00:00:00Z';
      mockStore.lastRunStatus = 'SUCCESS';

      const { result } = renderHook(() =>
        useSavePipeline({ wrapperRef: makeWrapperRef() }),
      );

      await act(async () => {
        await result.current.handleSavePipeline(false);
      });

      expect(mockMutateAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          lastRunStatus: 'SUCCESS',
          lastRunAt: expect.any(Date),
        }),
      );
    });
  });

  describe('handleSavePipeline — with screenshot', () => {
    it('calls fitView, waits, captures screenshot, sends to update', async () => {
      const { result } = renderHook(() =>
        useSavePipeline({ wrapperRef: makeWrapperRef() }),
      );

      const promise = result.current.handleSavePipeline(true);
      await act(async () => {
        await vi.advanceTimersByTimeAsync(400);
        await promise;
      });

      expect(mockFitView).toHaveBeenCalledWith({ padding: 0.2, duration: 300 });
      expect(mockToPng).toHaveBeenCalled();
      expect(mockMutateAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          screenshotBase64: 'data:image/png;base64,screenshot',
        }),
      );
    });

    it('returns undefined from captureScreenshot if no viewport', async () => {
      const { result } = renderHook(() =>
        useSavePipeline({ wrapperRef: makeWrapperRef(false) }),
      );

      const promise = result.current.handleSavePipeline(true);
      await act(async () => {
        await vi.advanceTimersByTimeAsync(400);
        await promise;
      });

      expect(mockToPng).not.toHaveBeenCalled();
      expect(mockMutateAsync).toHaveBeenCalledWith(
        expect.not.objectContaining({ screenshotBase64: expect.any(String) }),
      );
    });

    it('handles toPng failure gracefully', async () => {
      mockToPng.mockRejectedValue(new Error('canvas error'));
      vi.spyOn(console, 'error').mockImplementation(() => {});

      const { result } = renderHook(() =>
        useSavePipeline({ wrapperRef: makeWrapperRef() }),
      );

      const promise = result.current.handleSavePipeline(true);
      await act(async () => {
        await vi.advanceTimersByTimeAsync(400);
        await promise;
      });

      expect(console.error).toHaveBeenCalledWith(
        'Failed to capture canvas screenshot:',
        expect.any(Error),
      );
    });
  });

  describe('toast notifications', () => {
    it('shows success toast when notify=true', async () => {
      const { result } = renderHook(() =>
        useSavePipeline({ wrapperRef: makeWrapperRef() }),
      );

      await act(async () => {
        await result.current.handleSavePipeline(false, true);
      });

      expect(mockToastSuccess).toHaveBeenCalledWith('Pipeline saved');
    });

    it('shows error toast when mutation fails', async () => {
      mockMutateAsync.mockRejectedValue(new Error('network'));
      vi.spyOn(console, 'error').mockImplementation(() => {});

      const { result } = renderHook(() =>
        useSavePipeline({ wrapperRef: makeWrapperRef() }),
      );

      await act(async () => {
        await result.current.handleSavePipeline(false, true);
      });

      expect(mockStore.setSaveStatus).toHaveBeenCalledWith('error');
      expect(mockToastError).toHaveBeenCalledWith('Failed to save pipeline');
    });

    it('does not show toast when notify=false', async () => {
      const { result } = renderHook(() =>
        useSavePipeline({ wrapperRef: makeWrapperRef() }),
      );

      await act(async () => {
        await result.current.handleSavePipeline(false, false);
      });

      expect(mockToastSuccess).not.toHaveBeenCalled();
      expect(mockToastError).not.toHaveBeenCalled();
    });
  });

  describe('autosave — P1 guard', () => {
    it('does NOT call updatePipeline when saveStatus !== "unsaved"', async () => {
      mockStore.saveStatus = 'saved';

      renderHook(() => useSavePipeline({ wrapperRef: makeWrapperRef() }));

      await act(async () => {
        await vi.advanceTimersByTimeAsync(120_000);
      });

      expect(mockMutateAsync).not.toHaveBeenCalled();
    });

    it('does NOT autosave when saveStatus === "saving"', async () => {
      mockStore.saveStatus = 'saving';

      renderHook(() => useSavePipeline({ wrapperRef: makeWrapperRef() }));

      await act(async () => {
        await vi.advanceTimersByTimeAsync(120_000);
      });

      expect(mockMutateAsync).not.toHaveBeenCalled();
    });

    it('does NOT autosave when saveStatus === "error"', async () => {
      mockStore.saveStatus = 'error';

      renderHook(() => useSavePipeline({ wrapperRef: makeWrapperRef() }));

      await act(async () => {
        await vi.advanceTimersByTimeAsync(120_000);
      });

      expect(mockMutateAsync).not.toHaveBeenCalled();
    });

    it('DOES autosave when saveStatus === "unsaved"', async () => {
      mockStore.saveStatus = 'unsaved';

      renderHook(() => useSavePipeline({ wrapperRef: makeWrapperRef() }));

      await act(async () => {
        await vi.advanceTimersByTimeAsync(120_000);
      });

      expect(mockMutateAsync).toHaveBeenCalled();
    });

    it('does not autosave when no pipeline id', async () => {
      mockStore.saveStatus = 'unsaved';
      mockUseUser.mockReturnValue({ user: null });

      renderHook(() => useSavePipeline({ wrapperRef: makeWrapperRef() }));

      await act(async () => {
        await vi.advanceTimersByTimeAsync(120_000);
      });

      expect(mockMutateAsync).not.toHaveBeenCalled();
    });
  });
});
