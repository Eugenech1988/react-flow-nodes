import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SortIndicator } from './SortIndicator';

vi.mock('lucide-react', () => ({
  ArrowUp: () => <span data-testid="arrow-up" />,
  ArrowDown: () => <span data-testid="arrow-down" />,
  ArrowUpDown: () => <span data-testid="arrow-up-down" />,
}));

describe('SortIndicator', () => {
  it('renders ArrowUp for asc', () => {
    const { getByTestId, queryByTestId } = render(<SortIndicator state="asc" />);
    expect(getByTestId('arrow-up')).toBeInTheDocument();
    expect(queryByTestId('arrow-down')).not.toBeInTheDocument();
  });

  it('renders ArrowDown for desc', () => {
    const { getByTestId, queryByTestId } = render(<SortIndicator state="desc" />);
    expect(getByTestId('arrow-down')).toBeInTheDocument();
    expect(queryByTestId('arrow-up')).not.toBeInTheDocument();
  });

  it('renders ArrowUpDown for false', () => {
    const { getByTestId } = render(<SortIndicator state={false} />);
    expect(getByTestId('arrow-up-down')).toBeInTheDocument();
  });
});
