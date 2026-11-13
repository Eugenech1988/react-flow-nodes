import { render, screen } from '@testing-library/react';
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
  urlFor: () => ({}),
}));

vi.mock('./PortableBody', () => ({
  PortableBody: () => <div data-testid="portable-body" />,
}));

import { BlogPostBody } from './BlogPostBody';
import type { IBlogPostDetail } from '.';

const post: IBlogPostDetail = {
  id: '1',
  slug: 'hello',
  title: 'Hello World',
  excerpt: 'The excerpt',
  category: 'engineering',
  author: 'Jane',
  date: '2024.01.01',
  readTime: 8,
  body: [],
};

describe('BlogPostBody', () => {
  it('renders excerpt', () => {
    render(<BlogPostBody post={post} />);
    expect(screen.getByText('The excerpt')).toBeInTheDocument();
  });

  it('renders PortableBody', () => {
    render(<BlogPostBody post={post} />);
    expect(screen.getByTestId('portable-body')).toBeInTheDocument();
  });

  it('renders EOF marker', () => {
    render(<BlogPostBody post={post} />);
    expect(screen.getByText('EOF')).toBeInTheDocument();
    expect(screen.getByText('END OF TRANSMISSION')).toBeInTheDocument();
  });
});
