import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { ClearCanvasButton } from '@/widgets/canvas/components/ClearCanvasButton';

interface IDialogProps {
  children: ReactNode;
  open: boolean;
}

interface IChildrenProps {
  children: ReactNode;
}

interface IDialogCloseProps {
  children: ReactNode;
  onClick?: () => void;
}

const mockClearCanvas = vi.fn<() => void>();

vi.mock('@/entities', () => ({
  useStore: (selector: (state: { clearCanvas: () => void }) => unknown) =>
    selector({ clearCanvas: mockClearCanvas }),
}));

vi.mock('@pipeline/ui', async () => {
  const actual = await vi.importActual<typeof import('@pipeline/ui')>('@pipeline/ui');
  return {
    ...actual,
    Dialog: ({ children, open }: IDialogProps) =>
      open ? <div data-testid="dialog">{children}</div> : null,
    DialogContent: ({ children }: IChildrenProps) => <div>{children}</div>,
    DialogClose: ({ children, onClick }: IDialogCloseProps) => (
      <button onClick={onClick}>{children}</button>
    ),
    DialogHeader: ({ children }: IChildrenProps) => <div>{children}</div>,
    DialogTitle: ({ children }: IChildrenProps) => <h1>{children}</h1>,
    DialogDescription: ({ children }: IChildrenProps) => <p>{children}</p>,
    DialogFooter: ({ children }: IChildrenProps) => <footer>{children}</footer>,
  };
});

describe('ClearCanvasButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders trigger button correctly', () => {
    render(<ClearCanvasButton />);
    expect(screen.getByRole('button', { name: /clear canvas/i })).toBeInTheDocument();
  });

  it('opens dialog on click', () => {
    render(<ClearCanvasButton />);
    fireEvent.click(screen.getByRole('button', { name: /clear canvas/i }));
    expect(screen.getByTestId('dialog')).toBeInTheDocument();
    expect(screen.getByText(/are you sure you want to clear the canvas/i)).toBeInTheDocument();
  });

  it('closes dialog on cancel', () => {
    render(<ClearCanvasButton />);
    fireEvent.click(screen.getByRole('button', { name: /clear canvas/i }));
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(screen.queryByTestId('dialog')).not.toBeInTheDocument();
  });

  it('calls clearCanvas and closes on confirm', async () => {
    render(<ClearCanvasButton />);
    fireEvent.click(screen.getByRole('button', { name: /clear canvas/i }));
    const confirmButton = screen.getAllByRole('button', { name: /clear canvas/i })[1];
    fireEvent.click(confirmButton);

    expect(mockClearCanvas).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(screen.queryByTestId('dialog')).not.toBeInTheDocument();
    });
  });
});
