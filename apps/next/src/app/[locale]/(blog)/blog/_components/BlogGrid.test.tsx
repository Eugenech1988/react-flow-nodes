import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import type { ReactNode } from 'react';

vi.mock('@/shared/lib/i18n/client', () => ({
  useT: () => ({ t: (k: string) => k }),
  useChangeLanguage: () => vi.fn(),
  Trans: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

vi.mock('@/shared/lib/sanity', () => ({
  CATEGORY_ICONS: {},
  DEFAULT_CATEGORY_ICON: () => null,
}));

vi.mock('./BlogCard', () => ({
  BlogCard: ({ post }: { post: { title: string } }) => (
    <div data-testid="card">{post.title}</div>
  ),
}));

vi.mock('./BlogPagination', () => ({
  BlogPagination: ({
    currentPage,
    totalPages,
    onPageChange,
  }: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  }) => (
    <div data-testid="pagination">
      <span data-testid="page-state">
        {currentPage}/{totalPages}
      </span>
      <button onClick={() => onPageChange(currentPage + 1)}>next</button>
      <button onClick={() => onPageChange(currentPage - 1)}>prev</button>
      <button onClick={() => onPageChange(0)}>to-first</button>
      <button onClick={() => onPageChange(999)}>to-last</button>
    </div>
  ),
}));

import { BlogGrid } from './BlogGrid';
import type { IBlogPostPreview } from '.';

const posts: IBlogPostPreview[] = [
  { id: 'f', slug: 'feat', title: 'Featured', excerpt: 'feat', category: 'engineering', author: 'A', date: '2024.01.01', readTime: 1, featured: true },
  { id: 'a1', slug: 'a1', title: 'Alpha', excerpt: 'first', category: 'engineering', author: 'A', date: '2024.01.01', readTime: 1 },
  { id: 'b1', slug: 'b1', title: 'Beta', excerpt: 'second', category: 'design', author: 'A', date: '2024.01.01', readTime: 1 },
  { id: 'c1', slug: 'c1', title: 'Gamma', excerpt: 'third', category: 'engineering', author: 'A', date: '2024.01.01', readTime: 1 },
  { id: 'd1', slug: 'd1', title: 'Delta', excerpt: 'fourth', category: 'engineering', author: 'A', date: '2024.01.01', readTime: 1 },
];

const getMobileMenu = (container: HTMLElement) =>
  container.querySelector('[class*="md:hidden"]') as HTMLElement;

describe('BlogGrid', () => {
  it('renders first page non-featured posts only', () => {
    render(<BlogGrid posts={posts} locale="en" />);
    expect(screen.getByText('Alpha')).toBeInTheDocument();
    expect(screen.getByText('Beta')).toBeInTheDocument();
    expect(screen.getByText('Gamma')).toBeInTheDocument();
    expect(screen.queryByText('Delta')).not.toBeInTheDocument();
    expect(screen.queryByText('Featured')).not.toBeInTheDocument();
  });

  it('paginates to second page via next', () => {
    render(<BlogGrid posts={posts} locale="en" />);
    fireEvent.click(screen.getByText('next'));
    expect(screen.getByText('Delta')).toBeInTheDocument();
    expect(screen.queryByText('Alpha')).not.toBeInTheDocument();
    expect(screen.getByTestId('page-state')).toHaveTextContent('2/2');
  });

  it('navigates back via prev', () => {
    render(<BlogGrid posts={posts} locale="en" />);
    fireEvent.click(screen.getByText('next'));
    fireEvent.click(screen.getByText('prev'));
    expect(screen.getByText('Alpha')).toBeInTheDocument();
  });

  it('clamps page to first via to-first (0)', () => {
    render(<BlogGrid posts={posts} locale="en" />);
    fireEvent.click(screen.getByText('to-first'));
    expect(screen.getByTestId('page-state')).toHaveTextContent('1/2');
  });

  it('clamps page to last via to-last (999)', () => {
    render(<BlogGrid posts={posts} locale="en" />);
    fireEvent.click(screen.getByText('to-last'));
    expect(screen.getByTestId('page-state')).toHaveTextContent('2/2');
  });

  it('filters by category', () => {
    render(<BlogGrid posts={posts} locale="en" />);
    const designBtn = screen.getAllByText('categories.design')[0].closest('button')!;
    fireEvent.click(designBtn);
    expect(screen.getByText('Beta')).toBeInTheDocument();
    expect(screen.queryByText('Alpha')).not.toBeInTheDocument();
  });

  it('resets page to 1 on category change', () => {
    render(<BlogGrid posts={posts} locale="en" />);
    fireEvent.click(screen.getByText('next'));
    expect(screen.getByTestId('page-state')).toHaveTextContent('2/2');
    const designBtn = screen.getAllByText('categories.design')[0].closest('button')!;
    fireEvent.click(designBtn);
    expect(screen.getByTestId('page-state')).toHaveTextContent('1/1');
  });

  it('filters by search query', () => {
    render(<BlogGrid posts={posts} locale="en" />);
    const input = screen.getByPlaceholderText('search.placeholder');
    fireEvent.change(input, { target: { value: 'beta' } });
    expect(screen.getByText('Beta')).toBeInTheDocument();
    expect(screen.queryByText('Alpha')).not.toBeInTheDocument();
  });

  it('shows empty state on no results', () => {
    render(<BlogGrid posts={posts} locale="en" />);
    const input = screen.getByPlaceholderText('search.placeholder');
    fireEvent.change(input, { target: { value: 'zzzzz' } });
    expect(screen.getByText('empty')).toBeInTheDocument();
  });

  it('clears search via clear button', () => {
    render(<BlogGrid posts={posts} locale="en" />);
    const input = screen.getByPlaceholderText('search.placeholder');
    fireEvent.change(input, { target: { value: 'beta' } });
    fireEvent.click(screen.getByLabelText('Clear search'));
    expect(screen.getByText('Alpha')).toBeInTheDocument();
  });

  it('toggles mobile filter menu and selects a category', () => {
    const { container } = render(<BlogGrid posts={posts} locale="en" />);
    const mobile = getMobileMenu(container);
    fireEvent.click(mobile.querySelector('button')!);

    const designOpt = Array.from(mobile.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('SEC.03'),
    );
    expect(designOpt).toBeInTheDocument();
    fireEvent.click(designOpt!);

    expect(screen.getByText('Beta')).toBeInTheDocument();
    expect(screen.queryByText('Alpha')).not.toBeInTheDocument();
  });

  it('marks active category in reopened mobile menu', () => {
    const { container } = render(<BlogGrid posts={posts} locale="en" />);
    const mobile = getMobileMenu(container);

    fireEvent.click(mobile.querySelector('button')!);
    const designOpt = Array.from(mobile.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('SEC.03'),
    )!;
    fireEvent.click(designOpt);

    fireEvent.click(mobile.querySelector('button')!);
    const activeOpt = Array.from(mobile.querySelectorAll('button')).find(
      (b) =>
        b.textContent?.includes('SEC.03') &&
        b.className.includes('bg-theme-accent/20'),
    );
    expect(activeOpt).toBeInTheDocument();
  });
});
