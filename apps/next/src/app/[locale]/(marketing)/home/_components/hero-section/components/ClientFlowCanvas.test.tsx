import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import React from 'react';

vi.mock('@xyflow/react', () => {
  return {
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
  };
});

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

  it('renders nodes and removes loading state after timeout', () => {
    render(<ClientFlowCanvas />);

    act(() => {
      vi.advanceTimersByTime(600);
    });

    expect(screen.queryByText('INITIALIZING_CANVAS_NODES...')).not.toBeInTheDocument();
    expect(screen.getByTestId('react-flow')).toBeInTheDocument();
    expect(screen.getByText('CORE.INGEST')).toBeInTheDocument();
    expect(screen.getByText('NEURAL.ENGINE')).toBeInTheDocument();
    expect(screen.getByText('SHIELD.SECURE')).toBeInTheDocument();
  });

  it('covers CustomNode branches (hasTarget / hasSource false)', () => {
    render(<ClientFlowCanvas />);
    act(() => {
      vi.advanceTimersByTime(600);
    });

    const handles = screen.getAllByTestId('handle');
    expect(handles).toHaveLength(4);
  });

  it('handles media query changes for interactivity (covers lines 85-86)', () => {
    render(<ClientFlowCanvas />);
    
    const addEventListenerCall = mockMedia.addEventListener.mock.calls[0];
    expect(addEventListenerCall).toBeDefined();
    const [eventName, callback] = addEventListenerCall;
    expect(eventName).toBe('change');

    act(() => {
      callback({ matches: false } as MediaQueryListEvent);
    });

    expect(screen.getByTestId('react-flow')).toBeInTheDocument();
  });

  it('cleans up matchMedia listener on unmount', () => {
    const { unmount } = render(<ClientFlowCanvas />);
    unmount();
    expect(mockMedia.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function));
  });
});
