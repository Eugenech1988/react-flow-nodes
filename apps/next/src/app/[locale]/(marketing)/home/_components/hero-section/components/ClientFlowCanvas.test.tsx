import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import React from 'react';

vi.mock('@xyflow/react', () => ({
  ReactFlow: ({
    nodes,
    nodeTypes,
  }: {
    nodes: Array<{ id: string; data: unknown }>;
    nodeTypes: Record<string, React.FC<{ data: unknown }>>;
  }) => {
    const CustomNode = nodeTypes.custom;
    return (
      <div data-testid="react-flow">
        {nodes.map((n) => (
          <CustomNode key={n.id} data={n.data} />
        ))}
      </div>
    );
  },
  Background: () => null,
  Handle: () => <div data-testid="handle" />,
  Position: { Left: 'left', Right: 'right' },
  useNodesState: (initial: unknown[]) => {
    const [nodes, setNodes] = React.useState(initial);
    return [nodes, setNodes, vi.fn()];
  },
  useEdgesState: (initial: unknown[]) => {
    const [edges, setEdges] = React.useState(initial);
    return [edges, setEdges, vi.fn()];
  },
}));

vi.mock('@xyflow/react/dist/style.css', () => ({}));

import { ClientFlowCanvas } from './ClientFlowCanvas';

interface IMockMedia {
  matches: boolean;
  addEventListener: ReturnType<typeof vi.fn>;
  removeEventListener: ReturnType<typeof vi.fn>;
}

describe('ClientFlowCanvas', () => {
  let mockMedia: IMockMedia;

  beforeEach(() => {
    mockMedia = {
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };
    window.matchMedia = vi.fn().mockReturnValue(mockMedia);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders nodes immediately', () => {
    render(<ClientFlowCanvas />);
    expect(screen.getByText('CORE.INGEST')).toBeInTheDocument();
    expect(screen.getByText('NEURAL.ENGINE')).toBeInTheDocument();
    expect(screen.getByText('SHIELD.SECURE')).toBeInTheDocument();
  });

  it('handles media query false (interactive = false)', () => {
    mockMedia.matches = false;
    render(<ClientFlowCanvas />);
    const container = screen.getByTestId('react-flow').parentElement;
    expect(container).toHaveClass('pointer-events-none');
  });

  it('handles media query change event', () => {
    render(<ClientFlowCanvas />);
    const onChange = mockMedia.addEventListener.mock.calls[0][1] as (e: {
      matches: boolean;
    }) => void;

    act(() => {
      mockMedia.matches = false;
      onChange({ matches: false });
    });

    const container = screen.getByTestId('react-flow').parentElement;
    expect(container).toHaveClass('pointer-events-none');
  });
});
