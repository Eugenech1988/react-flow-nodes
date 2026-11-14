import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { HistoryControls } from './HistoryControls';

const mockStore = vi.hoisted(() => ({
  nodes: [] as unknown[],
  edges: [] as unknown[],
  nodeIDs: {} as Record<string, unknown>,
  past: [] as Array<{ nodes: unknown[]; edges: unknown[] }>,
  future: [] as Array<{ nodes: unknown[]; edges: unknown[] }>,
  undo: vi.fn<() => void>(),
  redo: vi.fn<() => void>(),
}));

type TStoreMock = typeof mockStore;

vi.mock('@/entities', () => ({
  useStore: (selector: (state: TStoreMock) => unknown) => selector(mockStore),
}));

describe('HistoryControls', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockStore.past = [];
    mockStore.future = [];
  });

  it('renders buttons in disabled state when history is empty', () => {
    render(<HistoryControls />);
    expect(screen.getByRole('button', { name: /undo/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /redo/i })).toBeDisabled();
  });

  it('enables undo button when there is past history', () => {
    mockStore.past = [{ nodes: [], edges: [] }];
    render(<HistoryControls />);
    expect(screen.getByRole('button', { name: /undo/i })).toBeEnabled();
    expect(screen.getByRole('button', { name: /redo/i })).toBeDisabled();
  });

  it('enables redo button when there is future history', () => {
    mockStore.future = [{ nodes: [], edges: [] }];
    render(<HistoryControls />);
    expect(screen.getByRole('button', { name: /undo/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /redo/i })).toBeEnabled();
  });

  it('calls undo action on click', () => {
    mockStore.past = [{ nodes: [], edges: [] }];
    render(<HistoryControls />);
    fireEvent.click(screen.getByRole('button', { name: /undo/i }));
    expect(mockStore.undo).toHaveBeenCalledTimes(1);
  });

  it('calls redo action on click', () => {
    mockStore.future = [{ nodes: [], edges: [] }];
    render(<HistoryControls />);
    fireEvent.click(screen.getByRole('button', { name: /redo/i }));
    expect(mockStore.redo).toHaveBeenCalledTimes(1);
  });
});
