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
  useChangeLanguage: () => vi.fn(),
  Trans: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

vi.mock('@/shared/lib/sanity', () => ({
  CATEGORY_ICONS: {},
  DEFAULT_CATEGORY_ICON: () => null,
  urlFor: () => ({}),
}));

vi.mock('@/shared/ui', () => ({
  Frame: ({ children, headerTitle }: { children: ReactNode; headerTitle?: ReactNode }) => (
    <div>
      <span data-testid="frame-header">{headerTitle}</span>
      {children}
    </div>
  ),
  Reveal: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

vi.mock('./BlogPostHeader', () => ({
  BlogPostHeader: ({ post }: { post: { title: string } }) => (
    <div data-testid="post-header">{post.title}</div>
  ),
}));

vi.mock('./BlogPostBody', () => ({
  BlogPostBody: ({ post }: { post: { excerpt: string } }) => (
    <div data-testid="post-body">{post.excerpt}</div>
  ),
}));

vi.mock('./BlogPostSidebar', () => ({
  BlogPostSidebar: ({ post }: { post: { author: string } }) => (
    <div data-testid="post-sidebar">{post.author}</div>
  ),
}));

import { BlogPostView } from './BlogPostView';
import type { IBlogPostDetail } from '.';

const post: IBlogPostDetail = {
  id: 'abc123def456',
  slug: 'hello',
  title: 'Hello World',
  excerpt: 'The excerpt',
  category: 'engineering',
  author: 'Jane',
  date: '2024.01.01',
  readTime: 8,
  body: [],
};

describe('BlogPostView', () => {
  it('renders header, body and sidebar', () => {
    render(<BlogPostView post={post} locale="en" />);
    expect(screen.getByTestId('post-header')).toHaveTextContent('Hello World');
    expect(screen.getByTestId('post-body')).toHaveTextContent('The excerpt');
    expect(screen.getByTestId('post-sidebar')).toHaveTextContent('Jane');
  });

  it('renders back link to blog', () => {
    render(<BlogPostView post={post} locale="en" />);
    const link = screen.getByText('details.returnToArchive').closest('a');
    expect(link).toHaveAttribute('href', '/en/blog');
  });

  it('renders entry id in frame header', () => {
    render(<BlogPostView post={post} locale="en" />);
    expect(screen.getByTestId('frame-header')).toHaveTextContent('ENTRY.ABC123');
  });

  it('uses placeholder id when post.id null', () => {
    render(<BlogPostView post={{ ...post, id: null }} locale="en" />);
    expect(screen.getByTestId('frame-header')).toHaveTextContent('ENTRY.------');
  });
});
