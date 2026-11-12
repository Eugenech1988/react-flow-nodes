import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import type { ReactNode } from 'react';

vi.mock('@/shared/lib/i18n/client', () => ({
  useT: () => ({ t: (key: string) => key }),
}));

vi.mock('@/features', () => ({
  InquiryModal: ({ children }: { children: ReactNode }) => (
    <div data-testid="inquiry-modal">{children}</div>
  ),
}));

vi.mock('@/shared/lib/app-url', () => ({
  APP_LOGIN_URL: 'https://login.test',
}));

vi.mock('@/shared/ui', () => ({
  AppButton: ({ children, isLink, linkTo }: any) =>
    isLink ? <a href={linkTo}>{children}</a> : <button>{children}</button>,
}));

import { HeroActions } from './HeroActions';

describe('HeroActions', () => {
  it('renders primary link button with correct url', () => {
    render(<HeroActions />);
    const primary = screen.getByRole('link', { name: 'hero.cta.primary' });
    expect(primary).toHaveAttribute('href', 'https://login.test');
  });

  it('renders demo button inside InquiryModal', () => {
    render(<HeroActions />);
    expect(screen.getByTestId('inquiry-modal')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'hero.cta.demo' })).toBeInTheDocument();
  });
});
