import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DialogHeader } from './DialogHeader';
import { MockDialogHeaderProps } from '@/test-utils';

vi.mock('@pipeline/ui', () => ({
  DialogHeader: ({ children, className }: MockDialogHeaderProps) => (
    <header className={className}>{children}</header>
  ),
  DialogTitle: ({ children, className }: MockDialogHeaderProps) => <h2 className={className}>{children}</h2>,
}));

describe('DialogHeader', () => {
  it('renders title and description', () => {
    render(<DialogHeader title="Edit" description="Some description" onClose={vi.fn()} />);
    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Some description')).toBeInTheDocument();
  });

  it('renders icon', () => {
    render(
      <DialogHeader title="Edit" icon={<span data-testid="icon">★</span>} onClose={vi.fn()} />,
    );
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('omits description when not provided', () => {
    const { container } = render(<DialogHeader title="Edit" onClose={vi.fn()} />);
    expect(container.querySelector('p')).not.toBeInTheDocument();
  });

  it('calls onClose when X clicked', () => {
    const onClose = vi.fn();
    render(<DialogHeader title="Edit" onClose={onClose} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onClose).toHaveBeenCalled();
  });
});
