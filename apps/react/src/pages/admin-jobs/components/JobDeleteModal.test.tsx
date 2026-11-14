import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { ReactNode } from 'react';
import { JobDeleteModal } from './JobDeleteModal';

interface IConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPending?: boolean;
  title: string;
  message: ReactNode;
}

vi.mock('@/shared/ui/ConfirmDeleteModal', () => ({
  ConfirmDeleteModal: ({
    isOpen,
    onClose,
    onConfirm,
    isPending,
    title,
    message,
  }: IConfirmDeleteModalProps) =>
    isOpen ? (
      <div data-testid="confirm-modal">
        <h2>{title}</h2>
        <div data-testid="confirm-message">{message}</div>
        <button onClick={onConfirm} disabled={isPending}>
          Confirm
        </button>
        <button onClick={onClose}>Cancel</button>
      </div>
    ) : null,
}));

describe('JobDeleteModal', () => {
  it('renders nothing when closed', () => {
    const { container } = render(
      <JobDeleteModal isOpen={false} onClose={vi.fn()} onConfirm={vi.fn()} jobSlug="x" />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders title and slug', () => {
    render(
      <JobDeleteModal isOpen onClose={vi.fn()} onConfirm={vi.fn()} jobSlug="senior-dev" />,
    );
    expect(screen.getByText('Delete Job')).toBeInTheDocument();
    expect(screen.getByTestId('confirm-message')).toHaveTextContent('senior-dev');
  });

  it('triggers onConfirm', () => {
    const onConfirm = vi.fn();
    render(<JobDeleteModal isOpen onClose={vi.fn()} onConfirm={onConfirm} jobSlug="x" />);
    fireEvent.click(screen.getByText('Confirm'));
    expect(onConfirm).toHaveBeenCalled();
  });

  it('triggers onClose', () => {
    const onClose = vi.fn();
    render(<JobDeleteModal isOpen onClose={onClose} onConfirm={vi.fn()} jobSlug="x" />);
    fireEvent.click(screen.getByText('Cancel'));
    expect(onClose).toHaveBeenCalled();
  });

  it('disables confirm when pending', () => {
    render(
      <JobDeleteModal isOpen onClose={vi.fn()} onConfirm={vi.fn()} jobSlug="x" isPending />,
    );
    expect(screen.getByText('Confirm')).toBeDisabled();
  });
});
