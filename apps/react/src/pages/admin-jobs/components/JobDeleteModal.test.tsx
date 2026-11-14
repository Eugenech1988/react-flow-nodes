import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { JobDeleteModal } from './JobDeleteModal';

vi.mock('@pipeline/ui', () => ({
  Dialog: ({ children, open }: unknown) => (open ? <div>{children}</div> : null),
  DialogContent: ({ children, onClick }: unknown) => (
    <div onClick={onClick}>{children}</div>
  ),
}));

vi.mock('@/shared/ui', () => ({
  DialogHeader: ({ title, onClose }: unknown) => (
    <div>
      <h2>{title}</h2>
      <button onClick={onClose}>X</button>
    </div>
  ),
  DialogBody: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogFooter: ({ onSubmit, onCancel, isPending }: unknown) => (
    <div>
      <button onClick={onSubmit} disabled={isPending}>Confirm</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  ),
}));

describe('JobDeleteModal', () => {
  it('renders nothing when closed', () => {
    const { container } = render(
      <JobDeleteModal isOpen={false} onClose={vi.fn()} onConfirm={vi.fn()} jobSlug="x" />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders title and slug', () => {
    render(<JobDeleteModal isOpen onClose={vi.fn()} onConfirm={vi.fn()} jobSlug="senior-dev" />);
    expect(screen.getByText('Delete Job')).toBeInTheDocument();
    expect(screen.getByText(/senior-dev/)).toBeInTheDocument();
  });

  it('triggers onConfirm', () => {
    const onConfirm = vi.fn();
    render(<JobDeleteModal isOpen onClose={vi.fn()} onConfirm={onConfirm} jobSlug="x" />);
    fireEvent.click(screen.getByText('Confirm'));
    expect(onConfirm).toHaveBeenCalled();
  });

  it('triggers onClose on header close', () => {
    const onClose = vi.fn();
    render(<JobDeleteModal isOpen onClose={onClose} onConfirm={vi.fn()} jobSlug="x" />);
    fireEvent.click(screen.getByText('X'));
    expect(onClose).toHaveBeenCalled();
  });

  it('disables confirm when pending', () => {
    render(
      <JobDeleteModal isOpen onClose={vi.fn()} onConfirm={vi.fn()} jobSlug="x" isPending />
    );
    expect(screen.getByText('Confirm').closest('button')).toBeDisabled();
  });
});
