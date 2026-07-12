import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ClearCanvasButton } from './ClearCanvasButton';
import { useStore } from '@/entities';

vi.mock('@/entities', () => ({
  useStore: vi.fn(),
}));

vi.mock('@/shared/ui/dialog', async () => {
  const actual = await vi.importActual('@/shared/ui/dialog');
  return {
    ...actual,
    Dialog: ({ children, open }: any) => (open ? <div data-testid="dialog">{children}</div> : null),
    DialogContent: ({ children }: any) => <div>{children}</div>,
    DialogClose: ({ children, onClick }: any) => <button onClick={onClick}>{children}</button>,
    DialogHeader: ({ children }: any) => <div>{children}</div>,
    DialogTitle: ({ children }: any) => <h1>{children}</h1>,
    DialogDescription: ({ children }: any) => <p>{children}</p>,
    DialogFooter: ({ children }: any) => <footer>{children}</footer>,
  };
});

describe('ClearCanvasButton', () => {
  const mockClearCanvas = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useStore as any).mockReturnValue(mockClearCanvas);
  });

  it('renders trigger button correctly', () => {
    render(<ClearCanvasButton />);
    expect(screen.getByRole('button', { name: /clear canvas/i })).toBeDefined();
  });

  it('opens dialog on click', () => {
    render(<ClearCanvasButton />);
    fireEvent.click(screen.getByRole('button', { name: /clear canvas/i }));
    expect(screen.getByTestId('dialog')).toBeDefined();
    expect(screen.getByText(/are you sure you want to clear the canvas/i)).toBeDefined();
  });

  it('closes dialog on cancel', () => {
    render(<ClearCanvasButton />);
    fireEvent.click(screen.getByRole('button', { name: /clear canvas/i }));
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(screen.queryByTestId('dialog')).toBeNull();
  });

  it('calls clearCanvas and closes on confirm', async () => {
    render(<ClearCanvasButton />);
    fireEvent.click(screen.getByRole('button', { name: /clear canvas/i }));
    const confirmButton = screen.getAllByRole('button', { name: /clear canvas/i })[1];
    fireEvent.click(confirmButton);

    expect(mockClearCanvas).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(screen.queryByTestId('dialog')).toBeNull();
    });
  });
});