import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { HistoryControls } from './HistoryControls';

const mockStore = vi.hoisted(() => ({
  nodes: [],
  edges: [],
  nodeIDs: {},
  past: [] as unknown[],
  future: [] as unknown[],
  undo: vi.fn(),
  redo: vi.fn(),
}));

vi.mock('@/entities', () => ({
  useStore: (selector: (state: typeof mockStore) => unknown) => selector(mockStore),
}));

vi.mock('@/shared/ui', () => ({
  Button: ({ children, onClick, disabled, 'aria-label': ariaLabel, title, ...props }: any) => (
    <button onClick={onClick} disabled={disabled} {...props}>
      {ariaLabel || title || children}
    </button>
  ),
}));

describe('HistoryControls', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockStore.past = [];
    mockStore.future = [];
  });

  it('renders buttons in disabled state when history is empty', () => {
    render(<HistoryControls />);

    const undoBtn = screen.getByRole('button', { name: /undo/i });
    const redoBtn = screen.getByRole('button', { name: /redo/i });

    expect(undoBtn).toBeDisabled();
    expect(redoBtn).toBeDisabled();
  });

  it('enables undo button when there is past history', () => {
    mockStore.past = [{ nodes: [], edges: [] }];
    render(<HistoryControls />);

    const undoBtn = screen.getByRole('button', { name: /undo/i });
    const redoBtn = screen.getByRole('button', { name: /redo/i });

    expect(undoBtn).toBeEnabled();
    expect(redoBtn).toBeDisabled();
  });

  it('enables redo button when there is future history', () => {
    mockStore.future = [{ nodes: [], edges: [] }];
    render(<HistoryControls />);

    const undoBtn = screen.getByRole('button', { name: /undo/i });
    const redoBtn = screen.getByRole('button', { name: /redo/i });

    expect(undoBtn).toBeDisabled();
    expect(redoBtn).toBeEnabled();
  });

  it('calls undo action on click', () => {
    mockStore.past = [{ nodes: [], edges: [] }];
    render(<HistoryControls />);

    const undoBtn = screen.getByRole('button', { name: /undo/i });
    fireEvent.click(undoBtn);

    expect(mockStore.undo).toHaveBeenCalledTimes(1);
  });

  it('calls redo action on click', () => {
    mockStore.future = [{ nodes: [], edges: [] }];
    render(<HistoryControls />);

    const redoBtn = screen.getByRole('button', { name: /redo/i });
    fireEvent.click(redoBtn);

    expect(mockStore.redo).toHaveBeenCalledTimes(1);
  });
});