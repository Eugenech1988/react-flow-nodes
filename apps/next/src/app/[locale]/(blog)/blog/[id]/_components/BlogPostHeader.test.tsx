import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import type { ReactNode } from 'react';

vi.mock('next/image', () => ({
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
}));

vi.mock('@/shared/lib/i18n/client', () => ({
  useT: () => ({ t: (k: string) => k }),
}));

vi.mock('@/shared/ui', () => ({
  Badge: ({ children }: { children: ReactNode }) => <span>{children}</span>,
}));

vi.mock('@/shared/lib/sanity', () => ({
  urlFor: () => ({
    width: () => ({ height: () => ({ fit: () => ({ url: () => 'https://cdn/img.jpg' }) }) }),
  }),
}));

import { BlogPostHeader } from './BlogPostHeader';
import type { IBlogPostDetail } from '.';

const post: IBlogPostDetail = {
  id: 'abc123def456',
  slug: 'hello',
  title: 'Hello World',
  excerpt: 'Excerpt',
  category: 'engineering',
  author: 'Jane',
  date: '2024.01.01',
  readTime: 8,
  body: [],
};

describe('BlogPostHeader', () => {
  it('renders title and category', () => {
    render(<BlogPostHeader post={post} />);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
    expect(screen.getByText('categories.engineering')).toBeInTheDocument();
  });

  it('renders entry ref', () => {
    render(<BlogPostHeader post={post} />);
    expect(screen.getByText(/ENTRY-ABC123/)).toBeInTheDocument();
  });

  it('renders placeholder ref when post.id is null', () => {
    render(<BlogPostHeader post={{ ...post, id: null }} />);
    expect(screen.getByText(/ENTRY------/)).toBeInTheDocument();
  });

  it('renders meta date, read time and author', () => {
    render(<BlogPostHeader post={post} />);
    expect(screen.getByText('2024.01.01')).toBeInTheDocument();
    expect(screen.getByText(/T-08/)).toBeInTheDocument();
    expect(screen.getByText(/OPR: JANE/)).toBeInTheDocument();
  });

  it('falls back to T-00 when readTime is 0', () => {
    render(<BlogPostHeader post={{ ...post, readTime: 0 }} />);
    expect(screen.getByText(/T-00/)).toBeInTheDocument();
  });

  it('renders image when mainImage provided', () => {
    const withImage = {
      ...post,
      mainImage: {} as unknown as IBlogPostDetail['mainImage'],
    } as IBlogPostDetail;
    render(<BlogPostHeader post={withImage} />);
    expect(screen.getByAltText('Hello World')).toBeInTheDocument();
  });

  it('skips image when mainImage missing', () => {
    render(<BlogPostHeader post={post} />);
    expect(screen.queryByAltText('Hello World')).not.toBeInTheDocument();
  });
});
