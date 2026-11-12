import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
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

vi.mock('@/shared/lib/i18n/client', () => ({
  useT: vi.fn(() => ({ t: (key: string) => key, i18n: { language: 'en' } })),
}));

vi.mock('@/shared/ui', () => ({
  AppButton: ({
    children,
    icon: Icon,
    isLink,
    linkTo,
    onClick,
    ...rest
  }: {
    children?: ReactNode;
    icon?: React.ComponentType;
    isLink?: boolean;
    linkTo?: string;
    onClick?: () => void;
    [k: string]: unknown;
  }) => {
    const content = (
      <>
        {Icon ? <Icon data-testid="btn-icon" /> : null}
        {children}
      </>
    );
    if (isLink)
      return (
        <a href={linkTo} onClick={onClick} {...rest}>
          {content}
        </a>
      );
    return (
      <button onClick={onClick} {...rest}>
        {content}
      </button>
    );
  },
}));

vi.mock('@/features', () => ({
  LanguageSwitcher: () => <div data-testid="lang-switcher" />,
  InquiryModal: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

import { Header } from './Header';
import { useT } from '@/shared/lib/i18n/client';

describe('Header', () => {
  beforeEach(() => vi.clearAllMocks());

  it('renders logo', () => {
    render(<Header />);
    expect(screen.getByTestId('logo')).toBeInTheDocument();
  });

  it('renders brand name', () => {
    render(<Header />);
    expect(screen.getByText('pipeline studio')).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(<Header />);
    expect(screen.getAllByRole('link', { name: 'header.nav.about' }).length).toBeGreaterThanOrEqual(
      1,
    );
    expect(screen.getAllByRole('link', { name: 'header.nav.blog' }).length).toBeGreaterThanOrEqual(
      1,
    );
    expect(
      screen.getAllByRole('link', { name: 'header.nav.careers' }).length,
    ).toBeGreaterThanOrEqual(1);
    expect(
      screen.getAllByRole('link', { name: 'header.nav.contacts' }).length,
    ).toBeGreaterThanOrEqual(1);
  });

  it('renders sign in link', () => {
    render(<Header />);
    expect(screen.getAllByRole('link', { name: 'header.signIn' }).length).toBeGreaterThanOrEqual(1);
  });

  it('renders language switcher', () => {
    render(<Header />);
    expect(screen.getAllByTestId('lang-switcher').length).toBeGreaterThanOrEqual(1);
  });

  it('toggles mobile menu open state', async () => {
    const { container } = render(<Header />);
    const overlay = container.querySelector('[class*="grid-rows-"]') as HTMLElement;
    expect(overlay).toHaveClass('grid-rows-[0fr]');
    await userEvent.click(screen.getByRole('button', { name: 'header.toggleMenu' }));
    expect(overlay).toHaveClass('grid-rows-[1fr]');
  });

  it('toggles mobile menu closed on second click', async () => {
    const { container } = render(<Header />);
    const overlay = container.querySelector('[class*="grid-rows-"]') as HTMLElement;
    const toggle = screen.getByRole('button', { name: 'header.toggleMenu' });
    await userEvent.click(toggle);
    expect(overlay).toHaveClass('grid-rows-[1fr]');
    await userEvent.click(toggle);
    expect(overlay).toHaveClass('grid-rows-[0fr]');
  });

  it('closes mobile menu on mobile nav link click', async () => {
    const { container } = render(<Header />);
    await userEvent.click(screen.getByRole('button', { name: 'header.toggleMenu' }));
    const overlay = container.querySelector('[class*="grid-rows-"]') as HTMLElement;
    expect(overlay).toHaveClass('grid-rows-[1fr]');

    const mobileNavLink = screen.getAllByRole('link', { name: 'header.nav.about' })[1];
    await userEvent.click(mobileNavLink);

    expect(overlay).toHaveClass('grid-rows-[0fr]');
  });

  it('closes mobile menu on mobile sign in click', async () => {
    const { container } = render(<Header />);
    await userEvent.click(screen.getByRole('button', { name: 'header.toggleMenu' }));
    const overlay = container.querySelector('[class*="grid-rows-"]') as HTMLElement;
    expect(overlay).toHaveClass('grid-rows-[1fr]');

    const mobileSignIn = screen.getAllByRole('link', { name: 'header.signIn' })[1];
    await userEvent.click(mobileSignIn);

    expect(overlay).toHaveClass('grid-rows-[0fr]');
  });

  it('closes mobile menu on mobile get started click', async () => {
    const { container } = render(<Header />);
    await userEvent.click(screen.getByRole('button', { name: 'header.toggleMenu' }));
    const overlay = container.querySelector('[class*="grid-rows-"]') as HTMLElement;
    expect(overlay).toHaveClass('grid-rows-[1fr]');

    const mobileGetStarted = screen.getAllByRole('link', { name: 'header.getStarted' })[1];
    await userEvent.click(mobileGetStarted);

    expect(overlay).toHaveClass('grid-rows-[0fr]');
  });

  it('falls back to en when i18n.language is missing', () => {
    vi.mocked(useT).mockReturnValueOnce({ t: (k: string) => k, i18n: {} } as never);
    render(<Header />);
    expect(screen.getByText('pipeline studio')).toBeInTheDocument();
  });

  it('applies rounded-2xl for default theme', () => {
    const { container } = render(<Header />);
    expect(container.querySelector('.backdrop-blur-xl')).toHaveClass('rounded-2xl');
  });

  it('applies rounded-sm for careers theme', () => {
    const { container } = render(<Header theme="careers" />);
    expect(container.querySelector('.backdrop-blur-xl')).toHaveClass('rounded-sm');
  });

  it('applies rounded-sm for blog theme', () => {
    const { container } = render(<Header theme="blog" />);
    expect(container.querySelector('.backdrop-blur-xl')).toHaveClass('rounded-sm');
  });
});
