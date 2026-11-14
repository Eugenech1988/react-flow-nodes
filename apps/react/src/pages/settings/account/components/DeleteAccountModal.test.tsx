import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ChangeEvent, ReactNode } from 'react';
import { DeleteAccountModal } from './DeleteAccountModal';

interface IDialogProps {
  children: ReactNode;
  open: boolean;
}

interface IChildrenProps {
  children: ReactNode;
}

interface IHeaderProps {
  title: string;
  onClose: () => void;
}

interface IFooterProps {
  onSubmit: () => void;
  onCancel: () => void;
  isDisabled?: boolean;
}

interface IInputProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  error?: boolean;
  errorMessage?: string;
}

vi.mock('@pipeline/ui', () => ({
  Dialog: ({ children, open }: IDialogProps) =>
    open ? <div data-testid="dialog">{children}</div> : null,
  DialogContent: ({ children }: IChildrenProps) => <div>{children}</div>,
}));

vi.mock('@/shared/ui', () => ({
  DialogHeader: ({ title, onClose }: IHeaderProps) => (
    <div>
      <h2>{title}</h2>
      <button onClick={onClose}>X</button>
    </div>
  ),
  DialogBody: ({ children }: IChildrenProps) => <div>{children}</div>,
  DialogFooter: ({ onSubmit, onCancel, isDisabled }: IFooterProps) => (
    <div>
      <button onClick={onSubmit} disabled={isDisabled}>
        Confirm
      </button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  ),
  FloatingInput: ({ value, onChange, error, errorMessage }: IInputProps) => (
    <div>
      <input data-testid="confirm-input" value={value} onChange={onChange} />
      {error && errorMessage && <span data-testid="confirm-error">{errorMessage}</span>}
    </div>
  ),
  LocalAlert: ({ alertMessage }: { alertMessage: string }) => (
    <div data-testid="local-alert">{alertMessage}</div>
  ),
}));

describe('DeleteAccountModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders nothing when closed', () => {
    const { container } = render(
      <DeleteAccountModal isOpen={false} onClose={vi.fn()} onConfirm={vi.fn()} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('requires DELETE text to confirm', () => {
    const onConfirm = vi.fn();
    render(<DeleteAccountModal isOpen onClose={vi.fn()} onConfirm={onConfirm} />);

    const confirmBtn = screen.getByText('Confirm').closest('button')!;
    expect(confirmBtn).toBeDisabled();

    fireEvent.change(screen.getByTestId('confirm-input'), {
      target: { value: 'DELETE' },
    });
    expect(confirmBtn).not.toBeDisabled();
    fireEvent.click(confirmBtn);
    expect(onConfirm).toHaveBeenCalled();
  });

  it('shows error on mismatch', () => {
    render(<DeleteAccountModal isOpen onClose={vi.fn()} onConfirm={vi.fn()} />);
    fireEvent.change(screen.getByTestId('confirm-input'), {
      target: { value: 'delete' },
    });
    expect(screen.getByTestId('confirm-error')).toHaveTextContent('Type "DELETE" exactly');
  });

  it('does not close if pending', () => {
    const onClose = vi.fn();
    render(
      <DeleteAccountModal isOpen onClose={onClose} onConfirm={vi.fn()} isDeletePending />,
    );
    fireEvent.click(screen.getByText('Cancel'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('renders errorMessage inside dialog when provided', () => {
    render(
      <DeleteAccountModal
        isOpen
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        errorMessage="Failed to delete account."
      />,
    );
    expect(screen.getByTestId('local-alert')).toHaveTextContent('Failed to delete account.');
  });

  it('does not render LocalAlert when errorMessage is null', () => {
    render(
      <DeleteAccountModal isOpen onClose={vi.fn()} onConfirm={vi.fn()} errorMessage={null} />,
    );
    expect(screen.queryByTestId('local-alert')).not.toBeInTheDocument();
  });
});
