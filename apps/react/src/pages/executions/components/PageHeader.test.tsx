import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PageHeader } from './PageHeader';

vi.mock('@/shared/ui', () => ({
  AppButton: ({ text, onClick, isPending }: unknown) => (
    <button onClick={onClick} disabled={isPending}>
      {text}
    </button>
  ),
}));

describe('PageHeader', () => {
  it('renders title and description', () => {
    render(<PageHeader handleRefresh={vi.fn()} />);
    expect(screen.getByText('Executions')).toBeInTheDocument();
    expect(screen.getByText(/Monitor, inspect/)).toBeInTheDocument();
  });

  it('calls handleRefresh on click', () => {
    const handleRefresh = vi.fn();
    render(<PageHeader handleRefresh={handleRefresh} />);
    fireEvent.click(screen.getByText('Refresh Logs'));
    expect(handleRefresh).toHaveBeenCalled();
  });

  it('disables button when fetching', () => {
    render(<PageHeader isFetching handleRefresh={vi.fn()} />);
    expect(screen.getByText('Refresh Logs').closest('button')).toBeDisabled();
  });
});
