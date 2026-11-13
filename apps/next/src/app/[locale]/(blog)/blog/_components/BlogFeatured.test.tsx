import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import type { ReactNode } from 'react';
import type { TFunction } from 'i18next';

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

vi.mock('@/shared/ui', () => ({
  Frame: ({
    children,
    headerTitle,
    footer,
  }: {
    children: ReactNode;
    headerTitle?: ReactNode;
    footer?: ReactNode;
  }) => (
    <div>
      <span data-testid="frame-header">{headerTitle}</span>
      {children}
      {footer}
    </div>
  ),
  AppButton: ({ children }: { children: ReactNode }) => <button>{children}</button>,
  Badge: ({ children }: { children: ReactNode }) => <span>{children}</span>,
}));

vi.mock('@/shared/lib/sanity', () => ({
  CATEGORY_ICONS: {},
  DEFAULT_CATEGORY_ICON: () => <svg data-testid="default-icon" />,
}));

import { BlogFeatured } from './BlogFeatured';
import type { IBlogPostPreview } from '.';

const t = ((key: string) => key) as unknown as TFunction<'blog'>;

const post: IBlogPostPreview = {
  id: 'fedcba654321',
  slug: 'featured',
  title: 'Featured Title',
  excerpt: 'Featured excerpt',
  category: 'design',
  author: 'John',
  date: '2024.02.02',
  readTime: 9,
  featured: true,
};

describe('BlogFeatured', () => {
  it('renders title and excerpt', () => {
    render(<BlogFeatured t={t} post={post} locale="en" />);
    expect(screen.getByText('Featured Title')).toBeInTheDocument();
    expect(screen.getByText('Featured excerpt')).toBeInTheDocument();
  });

  it('renders category badge and entry id in frame header', () => {
    render(<BlogFeatured t={t} post={post} locale="en" />);
    expect(screen.getByText('categories.design')).toBeInTheDocument();
    expect(screen.getByTestId('frame-header')).toHaveTextContent('ENTRY.FEDCBA');
  });

  it('renders placeholder entry id when post.id is null', () => {
    render(<BlogFeatured t={t} post={{ ...post, id: null }} locale="en" />);
    expect(screen.getByTestId('frame-header')).toHaveTextContent('ENTRY.------');
  });

  it('renders author, date and read time', () => {
    render(<BlogFeatured t={t} post={post} locale="en" />);
    expect(screen.getByText(/OPR: John/)).toBeInTheDocument();
    expect(screen.getByText('2024.02.02')).toBeInTheDocument();
    expect(screen.getByText(/T-09/)).toBeInTheDocument();
  });

  it('links to post page', () => {
    render(<BlogFeatured t={t} post={post} locale="en" />);
    expect(screen.getByRole('link')).toHaveAttribute('href', '/en/blog/featured');
  });
});
