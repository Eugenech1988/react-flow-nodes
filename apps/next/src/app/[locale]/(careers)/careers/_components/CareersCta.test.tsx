import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

vi.mock('@/shared/lib/i18n/client', () => ({
  useT: () => ({ t: (key: string) => key }),
}));

vi.mock('@/shared/ui', () => ({
  Frame: ({ children, footer }: any) => (
    <div>
      {children}
      {footer}
    </div>
  ),
  Reveal: ({ children }: any) => <div>{children}</div>,
  AppButton: ({ children, isLink, linkTo }: any) =>
    isLink ? <a href={linkTo}>{children}</a> : <button>{children}</button>,
}));

vi.mock('@/features', () => ({
  InquiryModal: ({ children }: any) => <div>{children}</div>,
}));

import { CareersCta } from './CareersCta';

describe('CareersCta', () => {
  it('renders CTA content and buttons', () => {
    render(<CareersCta />);
    expect(screen.getByText('cta.title')).toBeInTheDocument();
    expect(screen.getByText('cta.description')).toBeInTheDocument();
    expect(screen.getByText('cta.primary')).toBeInTheDocument();
    expect(screen.getByText('cta.email')).toBeInTheDocument();
  });
});
