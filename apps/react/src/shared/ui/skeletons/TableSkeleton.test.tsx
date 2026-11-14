import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TableSkeleton } from './TableSkeleton';

vi.mock('@pipeline/ui', () => ({
  Skeleton: ({ className, style }: unknown) => (
    <div data-testid="skeleton" className={className} style={style} />
  ),
  Table: ({ children }: { children: React.ReactNode }) => <table>{children}</table>,
  TableHeader: ({ children }: { children: React.ReactNode }) => <thead>{children}</thead>,
  TableBody: ({ children }: { children: React.ReactNode }) => <tbody>{children}</tbody>,
  TableRow: ({ children }: { children: React.ReactNode }) => <tr>{children}</tr>,
  TableHead: ({ children }: { children: React.ReactNode }) => <th>{children}</th>,
  TableCell: ({ children }: { children: React.ReactNode }) => <td>{children}</td>,
}));

describe('TableSkeleton', () => {
  it('renders default 5 rows × 4 columns + header', () => {
    const { container } = render(<TableSkeleton />);
    expect(container.querySelectorAll('tr')).toHaveLength(6);
    expect(container.querySelectorAll('th')).toHaveLength(4);
  });

  it('respects custom rowCount and columnCount', () => {
    const { container } = render(<TableSkeleton rowCount={3} columnCount={2} />);
    expect(container.querySelectorAll('tr')).toHaveLength(4);
    expect(container.querySelectorAll('th')).toHaveLength(2);
  });

  it('renders skeletons', () => {
    const { getAllByTestId } = render(<TableSkeleton rowCount={2} columnCount={3} />);
    expect(getAllByTestId('skeleton')).toHaveLength(2 * 3 + 3);
  });
});
