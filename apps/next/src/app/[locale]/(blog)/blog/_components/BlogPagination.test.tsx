import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import type { ReactNode } from 'react';

vi.mock('@/shared/lib/i18n/client', () => ({
  useT: () => ({ t: (k: string) => k }),
}));

vi.mock('@/shared/ui', () => ({
  AppButton: ({
    children,
    onClick,
    isDisabled,
  }: {
    children: ReactNode;
    onClick?: () => void;
    isDisabled?: boolean;
  }) => (
    <button onClick={onClick} disabled={isDisabled}>
      {children}
    </button>
  ),
}));

import { BlogPagination } from './BlogPagination';

describe('BlogPagination', () => {
  it('returns null when only one page', () => {
    const { container } = render(
      <BlogPagination currentPage={1} totalPages={1} onPageChange={vi.fn()} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders page numbers', () => {
    render(<BlogPagination currentPage={1} totalPages={3} onPageChange={vi.fn()} />);
    expect(screen.getByText('01')).toBeInTheDocument();
    expect(screen.getByText('02')).toBeInTheDocument();
    expect(screen.getByText('03')).toBeInTheDocument();
  });

  it('disables prev on first page', () => {
    render(<BlogPagination currentPage={1} totalPages={3} onPageChange={vi.fn()} />);
    expect(screen.getByText('pagination.prev').closest('button')).toBeDisabled();
  });

  it('disables next on last page', () => {
    render(<BlogPagination currentPage={3} totalPages={3} onPageChange={vi.fn()} />);
    expect(screen.getByText('pagination.next').closest('button')).toBeDisabled();
  });

  it('calls onPageChange on page click', () => {
    const onChange = vi.fn();
    render(<BlogPagination currentPage={1} totalPages={3} onPageChange={onChange} />);
    fireEvent.click(screen.getByText('02'));
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it('calls onPageChange on next click', () => {
    const onChange = vi.fn();
    render(<BlogPagination currentPage={1} totalPages={3} onPageChange={onChange} />);
    fireEvent.click(screen.getByText('pagination.next').closest('button')!);
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it('calls onPageChange on prev click', () => {
    const onChange = vi.fn();
    render(<BlogPagination currentPage={2} totalPages={3} onPageChange={onChange} />);
    fireEvent.click(screen.getByText('pagination.prev').closest('button')!);
    expect(onChange).toHaveBeenCalledWith(1);
  });
});
