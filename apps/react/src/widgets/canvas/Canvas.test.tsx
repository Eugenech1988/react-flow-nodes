import React from 'react';
import { fireEvent, render, screen, act } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Canvas } from '@/widgets/canvas/Canvas';
import { ReactFlowProvider } from '@xyflow/react';
import { MemoryRouter } from 'react-router-dom';
import type { ReactFlowProps, ReactFlowInstance } from '@xyflow/react';

const {
  mockInitGraph,
  mockResetGraph,
  mockAddNode,
  mockGetNodeID,
  mockOnNodesChange,
  mockOnEdgesChange,
  mockOnConnect,
  mockTakeSnapshot,
  mockExportJSON,
  mockImportJSON,
  mockUndo,
  mockRedo,
  mockRunWorkflow,
  mockUseUser,
} = vi.hoisted(() => ({
  mockInitGraph: vi.fn(),
  mockResetGraph: vi.fn(),
  mockAddNode: vi.fn(),
  mockGetNodeID: vi.fn(() => 'customInput-1'),
  mockOnNodesChange: vi.fn(),
  mockOnEdgesChange: vi.fn(),
  mockOnConnect: vi.fn(),
  mockTakeSnapshot: vi.fn(),
  mockExportJSON: vi.fn(),
  mockImportJSON: vi.fn(),
  mockUndo: vi.fn(),
  mockRedo: vi.fn(),
  mockRunWorkflow: vi.fn(),
  mockUseUser: vi.fn(),
}));

vi.mock('@/entities', () => ({
  useStore: vi.fn((selector: (state: unknown) => unknown) =>
    selector({
      nodes: [],
      edges: [],
      past: [],
      future: [],
      addNode: mockAddNode,
      getNodeID: mockGetNodeID,
      onNodesChange: mockOnNodesChange,
      onEdgesChange: mockOnEdgesChange,
      onConnect: mockOnConnect,
      takeSnapshot: mockTakeSnapshot,
      exportJSON: mockExportJSON,
      importJSON: mockImportJSON,
      undo: mockUndo,
      redo: mockRedo,
      runWorkflow: mockRunWorkflow,
      initGraph: mockInitGraph,
      resetGraph: mockResetGraph,
    }),
  ),
}));

vi.mock('@/app/providers/ThemeProvider', () => ({
  useTheme: () => ({ theme: 'light', resolvedTheme: 'light', setTheme: vi.fn() }),
}));

vi.mock('@/shared/hooks', () => ({
  useUser: () => mockUseUser(),
}));

vi.mock('@/widgets/canvas/components', () => ({
  HistoryControls: () => <div data-testid="history-controls" />,
  ImportExportToolbar: () => <div />,
  AutoLayoutButton: () => <div />,
  ClearCanvasButton: () => <div />,
  ExecutionLogConsole: () => <div />,
}));

let mockRfInstance: ReactFlowInstance | null = null;

vi.mock('@/widgets/canvas/hooks', () => ({
  useDragAndDrop: (args: {
    rfInstance: ReactFlowInstance | null;
    addNode: (n: unknown) => void;
    getNodeID: (t: string) => string;
  }) => ({
    onDragOver: (e: React.DragEvent) => e.preventDefault(),
    onDrop: (e: React.DragEvent) => {
      e.preventDefault();
      const rawData = e.dataTransfer.getData('application/reactflow');
      if (rawData) {
        const { nodeType } = JSON.parse(rawData);
        const id = args.getNodeID(nodeType);
        const instance = args.rfInstance ?? mockRfInstance;
        const position = instance?.screenToFlowPosition({ x: e.clientX, y: e.clientY }) ?? {
          x: 0,
          y: 0,
        };
        args.addNode({ id, type: nodeType, position, data: {} });
      }
    },
  }),
  useKeyboardShortcuts: vi.fn(),
  useSavePipeline: vi.fn(),
}));

vi.mock('@xyflow/react', async () => {
  const actual = await vi.importActual<typeof import('@xyflow/react')>('@xyflow/react');
  return {
    ...actual,
    ReactFlow: (props: ReactFlowProps) => {
      React.useEffect(() => {
        if (props.onInit) {
          mockRfInstance = {
            screenToFlowPosition: (pos: { x?: number; y?: number }) => ({
              x: pos.x ?? 100,
              y: pos.y ?? 200,
            }),
          } as ReactFlowInstance;
          props.onInit(mockRfInstance);
        }
      }, [props.onInit]);

      return (
        <div data-testid="react-flow" onDrop={props.onDrop} onDragOver={props.onDragOver}>
          {props.children}
        </div>
      );
    },
  };
});

interface IUserWithPipeline {
  currentPipeline: {
    id: string;
    graphData: { nodes: unknown[]; edges: unknown[] };
  };
}

const createPipelineUser = (
  id: string,
  graphData: unknown = { nodes: [], edges: [] },
): {
  user: IUserWithPipeline;
} => ({
  user: { currentPipeline: { id, graphData: graphData as { nodes: []; edges: [] } } },
});

describe('Canvas', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockRfInstance = null;
    mockUseUser.mockReturnValue({ user: null });
  });

  const renderCanvas = () =>
    render(
      <MemoryRouter>
        <ReactFlowProvider>
          <Canvas />
        </ReactFlowProvider>
      </MemoryRouter>,
    );

  it('renders ReactFlow component', () => {
    renderCanvas();
    expect(screen.getByTestId('react-flow')).toBeInTheDocument();
  });

  it('adds node on drop', async () => {
    renderCanvas();
    const flow = screen.getByTestId('react-flow');
    const store = { 'application/reactflow': JSON.stringify({ nodeType: 'customInput' }) };
    const dataTransfer = {
      setData: vi.fn(),
      getData: vi.fn((key: string) => store[key as keyof typeof store] ?? ''),
    } as unknown as DataTransfer;

    await act(async () => {
      fireEvent.drop(flow, { clientX: 100, clientY: 200, dataTransfer });
    });

    expect(mockGetNodeID).toHaveBeenCalledWith('customInput');
    expect(mockAddNode).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'customInput-1',
        type: 'customInput',
        position: { x: 100, y: 200 },
      }),
    );
  });

  describe('initGraph lifecycle', () => {
    it('does not call initGraph when there is no current pipeline', () => {
      mockUseUser.mockReturnValue({ user: null });
      renderCanvas();

      expect(mockInitGraph).not.toHaveBeenCalled();
    });

    it('calls initGraph once when user arrives with a current pipeline', () => {
      const graphData = {
        nodes: [{ id: 'n1', type: 'text', position: { x: 0, y: 0 }, data: {} }],
        edges: [],
      };
      mockUseUser.mockReturnValue(createPipelineUser('p1', graphData));

      renderCanvas();

      expect(mockInitGraph).toHaveBeenCalledTimes(1);
      expect(mockInitGraph).toHaveBeenCalledWith(
        [{ id: 'n1', type: 'text', position: { x: 0, y: 0 }, data: {} }],
        [],
        'p1',
      );
    });

    it('initializes empty graph when graphData fails to parse', () => {
      mockUseUser.mockReturnValue({
        user: { currentPipeline: { id: 'p1', graphData: 'not-an-object' } },
      });

      renderCanvas();

      expect(mockInitGraph).toHaveBeenCalledWith([], [], 'p1');
    });

    it('does NOT re-init when graphData ref changes for the SAME pipeline (refetch simulation)', () => {
      mockUseUser.mockReturnValue(createPipelineUser('p1'));
      const { rerender } = render(
        <MemoryRouter>
          <ReactFlowProvider>
            <Canvas />
          </ReactFlowProvider>
        </MemoryRouter>,
      );

      expect(mockInitGraph).toHaveBeenCalledTimes(1);

      mockUseUser.mockReturnValue(createPipelineUser('p1'));

      rerender(
        <MemoryRouter>
          <ReactFlowProvider>
            <Canvas />
          </ReactFlowProvider>
        </MemoryRouter>,
      );

      expect(mockInitGraph).toHaveBeenCalledTimes(1);
    });

    it('does NOT re-init even when new graphData has different content but same pipelineId', () => {
      mockUseUser.mockReturnValue(createPipelineUser('p1'));
      const { rerender } = render(
        <MemoryRouter>
          <ReactFlowProvider>
            <Canvas />
          </ReactFlowProvider>
        </MemoryRouter>,
      );

      expect(mockInitGraph).toHaveBeenCalledTimes(1);

      const newData = {
        nodes: [{ id: 'n2', type: 'llm', position: { x: 100, y: 100 }, data: {} }],
        edges: [],
      };
      mockUseUser.mockReturnValue(createPipelineUser('p1', newData));

      rerender(
        <MemoryRouter>
          <ReactFlowProvider>
            <Canvas />
          </ReactFlowProvider>
        </MemoryRouter>,
      );

      expect(mockInitGraph).toHaveBeenCalledTimes(1);
    });

    it('re-inits when pipelineId changes', () => {
      mockUseUser.mockReturnValue(createPipelineUser('p1'));
      const { rerender } = render(
        <MemoryRouter>
          <ReactFlowProvider>
            <Canvas />
          </ReactFlowProvider>
        </MemoryRouter>,
      );

      expect(mockInitGraph).toHaveBeenCalledTimes(1);
      expect(mockInitGraph).toHaveBeenLastCalledWith([], [], 'p1');

      mockUseUser.mockReturnValue(createPipelineUser('p2'));

      rerender(
        <MemoryRouter>
          <ReactFlowProvider>
            <Canvas />
          </ReactFlowProvider>
        </MemoryRouter>,
      );

      expect(mockInitGraph).toHaveBeenCalledTimes(2);
      expect(mockInitGraph).toHaveBeenLastCalledWith([], [], 'p2');
    });

    it('re-inits after user logs out and back in with the same pipeline', () => {
      mockUseUser.mockReturnValue(createPipelineUser('p1'));
      const { rerender } = render(
        <MemoryRouter>
          <ReactFlowProvider>
            <Canvas />
          </ReactFlowProvider>
        </MemoryRouter>,
      );

      expect(mockInitGraph).toHaveBeenCalledTimes(1);

      mockUseUser.mockReturnValue({ user: null });
      rerender(
        <MemoryRouter>
          <ReactFlowProvider>
            <Canvas />
          </ReactFlowProvider>
        </MemoryRouter>,
      );

      mockUseUser.mockReturnValue(createPipelineUser('p1'));
      rerender(
        <MemoryRouter>
          <ReactFlowProvider>
            <Canvas />
          </ReactFlowProvider>
        </MemoryRouter>,
      );

      expect(mockInitGraph).toHaveBeenCalledTimes(2);
    });

    it('calls resetGraph on unmount', () => {
      mockUseUser.mockReturnValue(createPipelineUser('p1'));
      const { unmount } = render(
        <MemoryRouter>
          <ReactFlowProvider>
            <Canvas />
          </ReactFlowProvider>
        </MemoryRouter>,
      );

      unmount();

      expect(mockResetGraph).toHaveBeenCalledTimes(1);
    });
  });
});
