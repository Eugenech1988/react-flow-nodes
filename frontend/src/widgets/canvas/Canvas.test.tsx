import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Canvas } from './Canvas';
import { ReactFlowProvider } from '@xyflow/react';
import type {
  ReactFlowProps,
  ReactFlowInstance
} from '@xyflow/react';

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

vi.mock('@/entities', () => ({
  useStore: vi.fn((selector) => selector({
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
  })),
}));

vi.mock('@/app/providers', () => ({
  useTheme: () => ({ theme: 'light' }),
}));

vi.mock('./components/HistoryControls', () => ({ HistoryControls: () => <div data-testid="history-controls" /> }));
vi.mock('./components/ImportExportToolbar', () => ({ ImportExportToolbar: () => <div /> }));
vi.mock('./components/AutoLayoutButton', () => ({ AutoLayoutButton: () => <div /> }));
vi.mock('./components/ClearCanvasButton', () => ({ ClearCanvasButton: () => <div /> }));
vi.mock('./canvas/components/WorkflowExecutionControl', () => ({ WorkflowExecutionControl: () => <div /> }));
vi.mock('./components/ExecutionLogConsole', () => ({ ExecutionLogConsole: () => <div /> }));

vi.mock('@xyflow/react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@xyflow/react')>();
  return {
    ...actual,
    ReactFlow: (props: ReactFlowProps) => {
      if (props.onInit) {
        queueMicrotask(() => {
          props.onInit?.({
            screenToFlowPosition: (pos: any) => ({
              x: pos.x ?? pos.clientX ?? 100,
              y: pos.y ?? pos.clientY ?? 200,
            }),
          } as ReactFlowInstance);
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
  });

  const renderCanvas = () => render(
    <ReactFlowProvider>
      <Canvas />
    </ReactFlowProvider>
  );

  it('renders ReactFlow component', () => {
    renderCanvas();
    expect(screen.getByTestId('react-flow')).toBeInTheDocument();
  });

  it('adds node on drop', async () => {
    renderCanvas();

    await new Promise((resolve) => setTimeout(resolve, 0));

    const flow = screen.getByTestId('react-flow');

    const dataTransfer = {
      data: { 'application/reactflow': JSON.stringify({ nodeType: 'customInput' }) },
      setData: vi.fn(),
      getData: vi.fn((key) => dataTransfer.data[key] || ''),
    } as unknown as DataTransfer;

    fireEvent.drop(flow, {
      clientX: 100,
      clientY: 200,
      dataTransfer,
    });

    expect(getNodeID).toHaveBeenCalledWith('customInput');

    expect(addNode).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'customInput-1',
        type: 'customInput',
        position: { x: 100, y: 200 },
      })
    );
  });
});