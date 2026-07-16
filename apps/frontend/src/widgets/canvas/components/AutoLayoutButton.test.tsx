import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AutoLayoutButton } from './AutoLayoutButton';

const mockSetNodes = vi.fn();
const mockLayoutedNodes = [{ id: '1', position: { x: 10, y: 10 } }];

vi.mock('@/entities', () => ({
  useStore: (selector: any) =>
    selector({
      nodes: [],
      edges: [],
      setNodes: mockSetNodes,
    }),
}));

vi.mock('@pipeline/lib/hooks', () => ({
  useAutoLayout: () => mockLayoutedNodes,
}));

describe('AutoLayoutButton', () => {
  it('renders correctly', () => {
    render(<AutoLayoutButton />);
    const button = screen.getByRole('button', { name: /auto layout/i });
    expect(button).toBeInTheDocument();
  });

  it('calls setNodes with layouted nodes when clicked', () => {
    render(<AutoLayoutButton />);
    const button = screen.getByRole('button', { name: /auto layout/i });

    fireEvent.click(button);

    expect(mockSetNodes).toHaveBeenCalledTimes(1);
    expect(mockSetNodes).toHaveBeenCalledWith(mockLayoutedNodes);
  });
});