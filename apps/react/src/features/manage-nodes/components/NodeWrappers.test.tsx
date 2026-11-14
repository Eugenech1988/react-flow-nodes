import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ReactFlowProvider } from '@xyflow/react';
import { TextNode } from './TextNode';
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
  return {
    useStore: (selector: any) => selector(mockState),
  };
});

vi.mock('@/shared/lib', () => ({
  extractVariables: vi.fn(() => []),
}));

describe('Node Wrappers', () => {
  it('renders TextNode', () => {
    render(
      <ReactFlowProvider>
        <TextNode id="t1" data={{}} selected={false} {...({} as any)} />
      </ReactFlowProvider>
    );
    expect(screen.getByText('Text')).toBeInTheDocument();
  });

  it('renders OutputNode', () => {
    const Node = OutputNode as any;
    render(
      <ReactFlowProvider>
        <Node id="o1" data={{}} selected={false} />
      </ReactFlowProvider>
    );
    expect(screen.getByText('Output')).toBeInTheDocument();
  });

  it('renders DatabaseNode', () => {
    render(
      <ReactFlowProvider>
        <DatabaseNode id="d1" data={{}} selected={false} {...({} as any)} />
      </ReactFlowProvider>
    );
    expect(screen.getByText('Database')).toBeInTheDocument();
  });
});
