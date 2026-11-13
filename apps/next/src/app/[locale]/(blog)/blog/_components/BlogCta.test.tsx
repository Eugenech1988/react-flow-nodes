import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import type { ReactNode } from 'react';

vi.mock('@/shared/lib/i18n/client', () => ({
  useT: () => ({ t: (k: string) => k }),
}));

vi.mock('@/shared/ui', () => ({
  Frame: ({ children, footer }: { children: ReactNode; footer?: ReactNode }) => (
    <div>
      {children}
      {footer}
    </div>
  ),
  Reveal: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  AppButton: ({ children }: { children: ReactNode }) => <button>{children}</button>,
  AppInput: ({ placeholder }: { placeholder?: string }) => <input placeholder={placeholder} />,
  SignalBars: () => <div data-testid="signal-bars" />,
}));

import { BlogCta } from './BlogCta';

describe('BlogCta', () => {
  it('renders title, description and submit', () => {
    render(<BlogCta />);
    expect(screen.getByText('cta.title')).toBeInTheDocument();
    expect(screen.getByText('cta.description')).toBeInTheDocument();
    expect(screen.getByText('cta.submit')).toBeInTheDocument();
  });

  it('renders email input', () => {
    render(<BlogCta />);
    expect(screen.getByPlaceholderText('cta.placeholder')).toBeInTheDocument();
  });

  it('renders status text in frame footer', () => {
    render(<BlogCta />);
    expect(screen.getByText('cta.status')).toBeInTheDocument();
  });
});