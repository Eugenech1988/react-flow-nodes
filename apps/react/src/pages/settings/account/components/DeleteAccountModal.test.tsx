import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DeleteAccountModal } from './DeleteAccountModal';

vi.mock('@pipeline/ui', () => ({
  Dialog: ({ children, open }: unknown) => (open ? <div>{children}</div> : null),
  DialogContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('@/shared/ui', () => ({
  DialogHeader: ({ title, onClose }: unknown) => (
    <div>
      <h2>{title}</h2>
      <button onClick={onClose}>X</button>
    </div>
  ),
  DialogBody: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogFooter: ({ onSubmit, onCancel, isDisabled }: unknown) => (
    <div>
      <button onClick={onSubmit} disabled={isDisabled}>
        Confirm
      </button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  ),
  FloatingInput: ({ value, onChange, error, errorMessage }: unknown) => (
    <div>
      <input data-testid="confirm-input" value={value} onChange={onChange} />
      {error && errorMessage && (
        <span data-testid="confirm-error">{errorMessage}</span>
      )}
    </div>
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
    expect(screen.getByTestId('confirm-error')).toHaveTextContent(
      'Type "DELETE" exactly',
    );
  });

  it('does not close if pending', () => {
    const onClose = vi.fn();
    render(
      <DeleteAccountModal
        isOpen
        onClose={onClose}
        onConfirm={vi.fn()}
        isDeletePending
      />,
    );
    fireEvent.click(screen.getByText('Cancel'));
    expect(onClose).not.toHaveBeenCalled();
  });
});
