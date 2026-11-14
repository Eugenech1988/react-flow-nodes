import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { ReactNode } from 'react';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';

interface IDialogProps {
  children: ReactNode;
  open: boolean;
}
interface IHeaderProps {
  title: string;
  onClose: () => void;
}
interface IFooterProps {
  onSubmit: () => void;
  onCancel: () => void;
  isPending: boolean;
  submitText: string;
}
interface IChildren {
  children: ReactNode;
}

vi.mock('@pipeline/ui', () => ({
  Dialog: ({ children, open }: IDialogProps) =>
    open ? <div data-testid="dialog">{children}</div> : null,
  DialogContent: ({
    children,
    onClick,
  }: IChildren & { onClick?: (e: React.MouseEvent) => void }) => (
    <div data-testid="dialog-content" onClick={onClick}>
      {children}
    </div>
  ),
}));

vi.mock('./dialog-parts/DialogHeader', () => ({
  DialogHeader: ({ title, onClose }: IHeaderProps) => (
    <div>
      <h2>{title}</h2>
      <button onClick={onClose}>header-close</button>
    </div>
  ),
}));

vi.mock('./dialog-parts/DialogBody', () => ({
  DialogBody: ({ children }: IChildren) => <div>{children}</div>,
}));

vi.mock('./dialog-parts/DialogFooter', () => ({
  DialogFooter: ({ onSubmit, onCancel, isPending, submitText }: IFooterProps) => (
    <div>
      <button onClick={onSubmit} disabled={isPending}>
        {submitText}
      </button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  ),
}));

describe('ConfirmDeleteModal', () => {
  it('renders nothing when closed', () => {
    const { container } = render(
      <ConfirmDeleteModal
        isOpen={false}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        title="x"
        message="y"
      />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders title and message', () => {
    render(
      <ConfirmDeleteModal
        isOpen
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        title="Delete Thing"
        message="Are you sure?"
      />,
    );
    expect(screen.getByText('Delete Thing')).toBeInTheDocument();
    expect(screen.getByText('Are you sure?')).toBeInTheDocument();
  });

  it('renders default submitText', () => {
    render(
      <ConfirmDeleteModal isOpen onClose={vi.fn()} onConfirm={vi.fn()} title="x" message="y" />,
    );
    expect(screen.getByText('Delete Permanently')).toBeInTheDocument();
  });

  it('renders custom submitText', () => {
    render(
      <ConfirmDeleteModal
        isOpen
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        title="x"
        message="y"
        submitText="Remove"
      />,
    );
    expect(screen.getByText('Remove')).toBeInTheDocument();
  });

  it('calls onConfirm on submit', () => {
    const onConfirm = vi.fn();
    render(
      <ConfirmDeleteModal isOpen onClose={vi.fn()} onConfirm={onConfirm} title="x" message="y" />,
    );
    fireEvent.click(screen.getByText('Delete Permanently'));
    expect(onConfirm).toHaveBeenCalled();
  });

  it('calls onClose on header close', () => {
    const onClose = vi.fn();
    render(
      <ConfirmDeleteModal isOpen onClose={onClose} onConfirm={vi.fn()} title="x" message="y" />,
    );
    fireEvent.click(screen.getByText('header-close'));
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onClose on cancel', () => {
    const onClose = vi.fn();
    render(
      <ConfirmDeleteModal isOpen onClose={onClose} onConfirm={vi.fn()} title="x" message="y" />,
    );
    fireEvent.click(screen.getByText('Cancel'));
    expect(onClose).toHaveBeenCalled();
  });

  it('stops propagation when clicking dialog content', () => {
    const onClose = vi.fn();
    render(
      <ConfirmDeleteModal isOpen onClose={onClose} onConfirm={vi.fn()} title="x" message="y" />,
    );
    const content = screen.getByTestId('dialog-content');
    fireEvent.click(content);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('passes custom pendingText to footer', () => {
    render(
      <ConfirmDeleteModal
        isOpen
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        title="x"
        message="y"
        pendingText="Processing..."
      />,
    );
    expect(screen.getByTestId('dialog-content')).toBeInTheDocument();
  });

  it('passes custom cancelText to footer', () => {
    render(
      <ConfirmDeleteModal
        isOpen
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        title="x"
        message="y"
        cancelText="Abort"
      />,
    );
    expect(screen.getByTestId('dialog-content')).toBeInTheDocument();
  });

  it('disables submit when pending', () => {
    render(
      <ConfirmDeleteModal
        isOpen
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        title="x"
        message="y"
        isPending
      />,
    );
    expect(screen.getByText('Delete Permanently')).toBeDisabled();
  });
});
