import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import type { ReactNode } from 'react';

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

vi.mock('@/shared/lib/i18n/client', () => ({
  useT: () => ({ t: (k: string) => k }),
}));

vi.mock('@/shared/lib/sanity', () => ({
  CATEGORY_ICONS: {},
  DEFAULT_CATEGORY_ICON: () => <svg data-testid="default-icon" />,
}));

import { BlogCard } from './BlogCard';
import type { IBlogPostPreview } from '.';

const post: IBlogPostPreview = {
  id: 'abcdef123456',
  slug: 'hello',
  title: 'Hello World',
  excerpt: 'Short excerpt',
  category: 'engineering',
  author: 'Jane',
  date: '2024.01.01',
  readTime: 7,
};

describe('BlogCard', () => {
  it('renders title and excerpt', () => {
    render(<BlogCard post={post} locale="en" />);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
    expect(screen.getByText('Short excerpt')).toBeInTheDocument();
  });

  it('renders link to post', () => {
    render(<BlogCard post={post} locale="en" />);
    expect(screen.getByRole('link')).toHaveAttribute('href', '/en/blog/hello');
  });

  it('renders entry id and category', () => {
    render(<BlogCard post={post} locale="en" />);
    expect(screen.getByText('ENTRY.ABCDEF')).toBeInTheDocument();
    expect(screen.getByText('categories.engineering')).toBeInTheDocument();
  });

  it('renders read time', () => {
    render(<BlogCard post={post} locale="en" />);
    expect(screen.getByText(/T-07/)).toBeInTheDocument();
  });

  it('falls back to placeholder when id is null', () => {
    render(<BlogCard post={{ ...post, id: null }} locale="en" />);
    expect(screen.getByText('ENTRY.------')).toBeInTheDocument();
  });
});
