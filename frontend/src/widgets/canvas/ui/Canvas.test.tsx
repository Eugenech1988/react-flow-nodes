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

const addNode = vi.fn();
const getNodeID = vi.fn(() => 'customInput-1');
const onNodesChange = vi.fn();
const onEdgesChange = vi.fn();
const onConnect = vi.fn();

//@ts-ignore
let reactFlowProps: ReactFlowProps;

type StoreState = {
  nodes: unknown[];
  edges: unknown[];
  addNode: typeof addNode;
  getNodeID: typeof getNodeID;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
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
    }),
}));

vi.mock('@/app/providers', () => ({
  useTheme: () => ({ theme: 'light' }),
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

      props.onInit?.({
        screenToFlowPosition: (pos: { x: number; y: number }) => pos,
      } as ReactFlowInstance);

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

  it('renders ReactFlow and controls', () => {
    render(<Canvas />);
    expect(screen.getByTestId('react-flow')).toBeInTheDocument();
  });

  it('adds node on drop', () => {
    render(<Canvas />);
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