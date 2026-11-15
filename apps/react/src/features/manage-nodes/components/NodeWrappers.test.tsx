import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ReactFlowProvider, type NodeProps } from '@xyflow/react';
import { OutputNode } from './OutputNode';
import { DatabaseNode } from './DatabaseNode';

vi.mock('@/entities', () => {
  const mockState = {
    updateNodeField: vi.fn(),
    activeNodeId: null,
    successNodeIds: [],
    failedNodeId: null,
    executionStatus: 'idle',
    runNode: vi.fn(),
  };
  return { useStore: (selector: (state: unknown) => unknown) => selector(mockState) };
});

vi.mock('@/shared/lib', () => ({ extractVariables: vi.fn(() => []) }));

type TestNodeProps = Omit<NodeProps, 'data'> & { data: Record<string, unknown> };

const makeNodeProps = (id: string): TestNodeProps => ({
  id,
  data: {},
  selected: false,
  type: 'test',
  dragging: false,
  draggable: false,
  selectable: false,
  deletable: false,
  zIndex: 0,
  isConnectable: true,
  positionAbsoluteX: 0,
  positionAbsoluteY: 0,
});

describe('Node Wrappers', () => {
  it('renders OutputNode', () => {
    render(
      <ReactFlowProvider>
        <OutputNode {...makeNodeProps('o1')} />
      </ReactFlowProvider>,
    );
    expect(screen.getByText('Output')).toBeInTheDocument();
  });

  it('renders DatabaseNode', () => {
    render(
      <ReactFlowProvider>
        <DatabaseNode {...makeNodeProps('d1')} />
      </ReactFlowProvider>,
    );
    expect(screen.getByText('Database')).toBeInTheDocument();
  });
});