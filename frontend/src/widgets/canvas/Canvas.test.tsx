import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Canvas } from './Canvas';
import type {
  ReactFlowProps,
  NodeChange,
  EdgeChange,
  Connection,
  ReactFlowInstance
} from '@xyflow/react';
import type { PipelineNode, PipelineEdge } from '@/entities/pipeline';

const addNode = vi.fn();
const getNodeID = vi.fn(() => 'customInput-1');
const onNodesChange = vi.fn();
const onEdgesChange = vi.fn();
const onConnect = vi.fn();
const takeSnapshot = vi.fn();
const exportJSON = vi.fn();
const importJSON = vi.fn();

//@ts-ignore
let reactFlowProps: ReactFlowProps;

type StoreState = {
  nodes: PipelineNode[];
  edges: PipelineEdge[];
  addNode: typeof addNode;
  getNodeID: typeof getNodeID;
  onNodesChange: (changes: NodeChange<PipelineNode>[]) => void;
  onEdgesChange: (changes: EdgeChange<PipelineEdge>[]) => void;
  onConnect: (connection: Connection) => void;
  takeSnapshot: typeof takeSnapshot;
  exportJSON: typeof exportJSON;
  importJSON: typeof importJSON;
};

vi.mock('@/entities/pipeline', () => ({
  useStore: (selector: (state: StoreState) => unknown) =>
    selector({
      nodes: [],
      edges: [],
      addNode,
      getNodeID,
      onNodesChange,
      onEdgesChange,
      onConnect,
      takeSnapshot,
      exportJSON,
      importJSON,
    }),
}));

vi.mock('@/app/providers', () => ({
  useTheme: () => ({ theme: 'light' }),
}));

// Изолируем HistoryControls, чтобы он не ломал рендеринг Canvas в тестовом окружении
vi.mock('./components/HistoryControls', () => ({
  HistoryControls: () => <div data-testid="history-controls" />,
}));

vi.mock('@xyflow/react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@xyflow/react')>();
  return {
    ...actual,
    ReactFlowProvider: ({ children }: { children: React.ReactNode }) => children,
    Background: ({ color }: { color: string }) => <div data-testid="background">{color}</div>,
    Controls: () => <div data-testid="controls" />,
    MiniMap: () => <div data-testid="minimap" />,
    ReactFlow: (props: ReactFlowProps) => {
      reactFlowProps = props;

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
        <div
          data-testid="react-flow"
          onDrop={props.onDrop}
          onDragOver={props.onDragOver}
        >
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

  it('renders ReactFlow, controls, export and import buttons', () => {
    render(<Canvas />);
    expect(screen.getByTestId('react-flow')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /export/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /import/i })).toBeInTheDocument();
  });

  it('triggers exportJSON when Export button is clicked', () => {
    render(<Canvas />);
    const exportBtn = screen.getByRole('button', { name: /export/i });
    fireEvent.click(exportBtn);
    expect(exportJSON).toHaveBeenCalledTimes(1);
  });

  it('adds node on drop', async () => {
    render(<Canvas />);

    await new Promise((resolve) => setTimeout(resolve, 0));

    const flow = screen.getByTestId('react-flow');

    const dataTransfer = {
      getData: () => JSON.stringify({ nodeType: 'customInput' }),
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