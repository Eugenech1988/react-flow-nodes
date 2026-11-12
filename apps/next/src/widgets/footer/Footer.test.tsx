import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import type { ReactNode } from 'react';

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: ReactNode;
    [k: string]: unknown;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock('@/assets/logo.svg', () => ({
  default: () => <svg data-testid="logo" />,
}));

vi.mock('@/shared/ui', () => ({
  Badge: ({ children }: { children: React.ReactNode }) => (
    <span data-testid="badge">{children}</span>
  ),
  Rivets: () => <span data-testid="rivets" />,
  SocialLinks: () => <div data-testid="social-links" />,
}));

vi.mock('@/shared/lib/i18n/server', () => ({
  getT: vi.fn(async () => ({ t: (key: string) => key, lng: 'en' })),
}));

vi.mock('@/shared/lib/i18n/client', () => ({
  useT: () => ({ t: (key: string) => key }),
}));

import { Footer } from './Footer';

describe('Footer', () => {
  it('renders footer description', async () => {
    render(await Footer({}));
    expect(screen.getByText('footer.description')).toBeInTheDocument();
  });

  it('renders copyright', async () => {
    render(await Footer({}));
    expect(screen.getByText(/footer\.copyright/)).toBeInTheDocument();
  });

  it('renders logo', async () => {
    render(await Footer({}));
    expect(screen.getByTestId('logo')).toBeInTheDocument();
  });

  it('renders all 4 footer columns', async () => {
    render(await Footer({}));
    expect(screen.getByText('footer.columns.product.title')).toBeInTheDocument();
    expect(screen.getByText('footer.columns.resources.title')).toBeInTheDocument();
    expect(screen.getByText('footer.columns.company.title')).toBeInTheDocument();
    expect(screen.getByText('footer.columns.legal.title')).toBeInTheDocument();
  });

  it('renders company link with correct href', async () => {
    render(await Footer({}));
    expect(
      screen.getByRole('link', { name: 'footer.columns.company.links.about' }),
    ).toHaveAttribute('href', '/en/about');
  });

  it('renders badge', async () => {
    render(await Footer({}));
    expect(screen.getByText('footer.badge')).toBeInTheDocument();
  });

  it('applies rounded-sm for careers theme', async () => {
    const { container } = render(await Footer({ theme: 'careers' }));
    const card = container.querySelector('.backdrop-blur-xl');
    expect(card).toHaveClass('rounded-sm');
  });

  it('applies rounded-2xl for default theme', async () => {
    const { container } = render(await Footer({}));
    const card = container.querySelector('.backdrop-blur-xl');
    expect(card).toHaveClass('rounded-2xl');
  });

  it('applies rounded-sm for blog theme', async () => {
    const { container } = render(await Footer({ theme: 'blog' }));
    const card = container.querySelector('.backdrop-blur-xl');
    expect(card).toHaveClass('rounded-sm');
  });
});
