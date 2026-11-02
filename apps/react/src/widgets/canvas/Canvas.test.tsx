import { fireEvent, render, screen, act } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Canvas } from '@/widgets/canvas/Canvas';
import { ReactFlowProvider } from '@xyflow/react';
import { MemoryRouter } from 'react-router-dom';
import type { ReactFlowProps, ReactFlowInstance } from '@xyflow/react';

const addNode = vi.fn();
const getNodeID = vi.fn(() => 'customInput-1');
const onNodesChange = vi.fn();
const onEdgesChange = vi.fn();
const onConnect = vi.fn();
const takeSnapshot = vi.fn();
const exportJSON = vi.fn();
const importJSON = vi.fn();
const undo = vi.fn();
const redo = vi.fn();
const runWorkflow = vi.fn();
const initGraph = vi.fn();
const resetGraph = vi.fn();

vi.mock('@/entities', () => ({
  useStore: vi.fn((selector) =>
    selector({
      nodes: [],
      edges: [],
      past: [],
      future: [],
      addNode,
      getNodeID,
      onNodesChange,
      onEdgesChange,
      onConnect,
      takeSnapshot,
      exportJSON,
      importJSON,
      undo,
      redo,
      runWorkflow,
      initGraph,
      resetGraph,
    }),
  ),
}));

vi.mock('@/shared/hooks', () => ({
  useUser: () => ({ user: null }),
}));

vi.mock('@/widgets/canvas/components', () => ({
  HistoryControls: () => <div data-testid="history-controls" />,
  ImportExportToolbar: () => <div />,
  AutoLayoutButton: () => <div />,
  ClearCanvasButton: () => <div />,
  ExecutionLogConsole: () => <div />,
}));

let mockRfInstance: any = null;

vi.mock('@/widgets/canvas/hooks', () => ({
  useDragAndDrop: (args: { rfInstance: any; addNode: any; getNodeID: any }) => ({
    onDragOver: (e: React.DragEvent) => e.preventDefault(),
    onDrop: (e: React.DragEvent) => {
      e.preventDefault();
      const rawData = e.dataTransfer.getData('application/reactflow');
      if (rawData) {
        const { nodeType } = JSON.parse(rawData);
        const id = args.getNodeID(nodeType);
        const instance = args.rfInstance || mockRfInstance;
        const position = instance?.screenToFlowPosition({
          x: e.clientX,
          y: e.clientY,
        }) || { x: 0, y: 0 };

        args.addNode({
          id,
          type: nodeType,
          position,
          data: {},
        });
      }
    },
  }),
  useKeyboardShortcuts: vi.fn(),
  useSavePipeline: vi.fn(),
}));

vi.mock('@xyflow/react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@xyflow/react')>();
  return {
    ...actual,
    ReactFlow: (props: ReactFlowProps) => {
      if (props.onInit) {
        mockRfInstance = {
          screenToFlowPosition: (pos: any) => ({
            x: pos.x ?? 100,
            y: pos.y ?? 200,
          }),
        };
        act(() => {
          props.onInit?.(mockRfInstance as ReactFlowInstance);
        });
      }
      return (
        <div data-testid="react-flow" onDrop={props.onDrop} onDragOver={props.onDragOver}>
          {props.children}
        </div>
      );
    },
  };
});

describe('Canvas', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockRfInstance = null;
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
      getData: vi.fn((key: string) => store[key as keyof typeof store] || ''),
    } as unknown as DataTransfer;

    await act(async () => {
      fireEvent.drop(flow, {
        clientX: 100,
        clientY: 200,
        dataTransfer,
      });
    });

    expect(getNodeID).toHaveBeenCalledWith('customInput');

    expect(addNode).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'customInput-1',
        type: 'customInput',
        position: { x: 100, y: 200 },
      }),
    );
  });
});
