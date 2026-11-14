import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
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

vi.mock('@/shared/ui', () => ({
  Frame: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  Reveal: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  AppButton: ({ children, onClick }: { children: ReactNode; onClick?: () => void }) => (
    <button onClick={onClick}>{children}</button>
  ),
}));

import { BlogPostSidebar } from './BlogPostSidebar';
import type { IBlogPostDetail } from '.';

const post: IBlogPostDetail = {
  id: '1',
  slug: 'hello',
  title: 'Hello World',
  excerpt: 'Excerpt',
  category: 'engineering',
  author: 'Jane',
  date: '2024.01.01',
  readTime: 8,
  body: [],
};

afterEach(() => {
  Object.defineProperty(navigator, 'share', { configurable: true, value: undefined });
});

describe('BlogPostSidebar', () => {
  it('renders author name', () => {
    render(<BlogPostSidebar post={post} locale="en" />);
    expect(screen.getByText('Jane')).toBeInTheDocument();
  });

  it('renders meta fields', () => {
    render(<BlogPostSidebar post={post} locale="en" />);
    expect(screen.getByText('2024.01.01')).toBeInTheDocument();
    expect(screen.getByText('T-08')).toBeInTheDocument();
    expect(screen.getByText('engineering')).toBeInTheDocument();
  });

  it('renders back link', () => {
    render(<BlogPostSidebar post={post} locale="en" />);
    const link = screen.getByText('details.returnToArchive').closest('a');
    expect(link).toHaveAttribute('href', '/en/blog');
  });

  it('shows fallback when readTime missing', () => {
    render(<BlogPostSidebar post={{ ...post, readTime: 0 } as IBlogPostDetail} locale="en" />);
    expect(screen.getByText('T-00')).toBeInTheDocument();
  });

  it('share button does nothing when navigator.share missing', () => {
    render(<BlogPostSidebar post={post} locale="en" />);
    expect(() => fireEvent.click(screen.getByText('details.share'))).not.toThrow();
  });

  it('calls navigator.share on click', async () => {
    const shareMock = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'share', { configurable: true, value: shareMock });

    render(<BlogPostSidebar post={post} locale="en" />);
    fireEvent.click(screen.getByText('details.share'));

    await waitFor(() =>
      expect(shareMock).toHaveBeenCalledWith({
        title: 'Hello World',
        url: expect.any(String),
      }),
    );
  });

  it('swallows navigator.share rejection', async () => {
    const shareMock = vi.fn().mockRejectedValue(new Error('abort'));
    Object.defineProperty(navigator, 'share', { configurable: true, value: shareMock });

    render(<BlogPostSidebar post={post} locale="en" />);
    expect(() => fireEvent.click(screen.getByText('details.share'))).not.toThrow();

    await waitFor(() => expect(shareMock).toHaveBeenCalled());
  });
});
