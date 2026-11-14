import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

interface IStoreStateMock {
  nodes: { id: string; position: { x: number; y: number } }[];
  edges: unknown[];
  setNodes: ReturnType<typeof vi.fn>;
  takeSnapshot: ReturnType<typeof vi.fn>;
}

const { mockSetNodes, mockTakeSnapshot, mockLayoutedNodes } = vi.hoisted(() => ({
  mockSetNodes: vi.fn(),
  mockTakeSnapshot: vi.fn(),
  mockLayoutedNodes: [{ id: '1', position: { x: 10, y: 10 } }],
}));

vi.mock('@/entities', () => {
  const state: IStoreStateMock = {
    nodes: [{ id: '1', position: { x: 0, y: 0 } }],
    edges: [],
    setNodes: mockSetNodes,
    takeSnapshot: mockTakeSnapshot,
  };

  return {
    useStore: <T,>(selector: (state: IStoreStateMock) => T): T => selector(state),
  };
});

vi.mock('../lib/autoLayout', () => ({
  computeAutoLayout: vi.fn(() => mockLayoutedNodes),
}));

import { AutoLayoutButton } from './AutoLayoutButton';
import { computeAutoLayout } from '../lib/autoLayout';

describe('AutoLayoutButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<AutoLayoutButton />);
    expect(screen.getByRole('button', { name: /auto layout/i })).toBeInTheDocument();
  });

  it('takes a snapshot before applying layout (enables undo)', () => {
    render(<AutoLayoutButton />);
    fireEvent.click(screen.getByRole('button', { name: /auto layout/i }));

    expect(mockTakeSnapshot).toHaveBeenCalledTimes(1);
  });

  it('calls setNodes with layouted nodes when clicked', () => {
    render(<AutoLayoutButton />);
    fireEvent.click(screen.getByRole('button', { name: /auto layout/i }));

    expect(mockSetNodes).toHaveBeenCalledTimes(1);
    expect(mockSetNodes).toHaveBeenCalledWith(mockLayoutedNodes);
  });

  it('calls takeSnapshot before setNodes', () => {
    const order: string[] = [];

    mockTakeSnapshot.mockImplementationOnce(() => {
      order.push('snapshot');
    });
    mockSetNodes.mockImplementationOnce(() => {
      order.push('setNodes');
    });

    render(<AutoLayoutButton />);
    fireEvent.click(screen.getByRole('button', { name: /auto layout/i }));

    expect(order).toEqual(['snapshot', 'setNodes']);
  });

  it('does not compute layout on render (only on click)', () => {
    render(<AutoLayoutButton />);

    expect(computeAutoLayout).not.toHaveBeenCalled();
  });

  it('computes layout exactly once per click', () => {
    render(<AutoLayoutButton />);
    fireEvent.click(screen.getByRole('button', { name: /auto layout/i }));

    expect(computeAutoLayout).toHaveBeenCalledTimes(1);
  });
});
