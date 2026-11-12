import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import React from 'react';

vi.mock('@xyflow/react', () => ({
  ReactFlow: ({ nodes, nodeTypes }: any) => {
    const CustomNode = nodeTypes.custom;
    return (
      <div data-testid="react-flow">
        {nodes.map((n: any) => (
          <CustomNode key={n.id} data={n.data} />
        ))}
      </div>
    );
  },
  Background: () => null,
  Handle: () => <div data-testid="handle" />,
  Position: { Left: 'left', Right: 'right' },
  useNodesState: (initial: any) => {
    const [nodes, setNodes] = React.useState(initial);
    return [nodes, setNodes, vi.fn()];
  },
  useEdgesState: (initial: any) => {
    const [edges, setEdges] = React.useState(initial);
    return [edges, setEdges, vi.fn()];
  },
}));

vi.mock('@xyflow/react/dist/style.css', () => ({}));

import { ClientFlowCanvas } from './ClientFlowCanvas';

describe('ClientFlowCanvas', () => {
  let mockMedia: any;

  beforeEach(() => {
    vi.useFakeTimers();
    mockMedia = {
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };
    window.matchMedia = vi.fn().mockReturnValue(mockMedia);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('shows loading state initially', () => {
    render(<ClientFlowCanvas />);
    expect(screen.getByText('INITIALIZING_CANVAS_NODES...')).toBeInTheDocument();
  });

  it('renders nodes after timeout', () => {
    render(<ClientFlowCanvas />);
    act(() => {
      vi.advanceTimersByTime(600);
    });
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
    const onChange = mockMedia.addEventListener.mock.calls[0][1];

    act(() => {
      onChange({ matches: false });
    });

    const container = screen.getByTestId('react-flow').parentElement;
    expect(container).toHaveClass('pointer-events-none');
  });

  it('clears timer on unmount', () => {
    const { unmount } = render(<ClientFlowCanvas />);
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});
