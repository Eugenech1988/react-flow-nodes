import { render, screen, fireEvent } from '@testing-library/react';
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
  AppButton: ({ children }: { children: ReactNode }) => <button type="submit">{children}</button>,
  AppInput: ({ placeholder, value, onChange }: any) => (
    <input placeholder={placeholder} value={value} onChange={onChange} />
  ),
  SignalBars: () => <div data-testid="signal-bars" />,
  BackgroundGrid: () => <div data-testid="background-grid" />,
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

  it('handles input change and form submit', () => {
    render(<BlogCta />);
    const input = screen.getByPlaceholderText('cta.placeholder') as HTMLInputElement;
    const form = screen.getByText('cta.submit').closest('form')!;

    fireEvent.change(input, { target: { value: 'test@test.com' } });
    expect(input.value).toBe('test@test.com');

    fireEvent.submit(form);
    expect(input.value).toBe('');
  });
});