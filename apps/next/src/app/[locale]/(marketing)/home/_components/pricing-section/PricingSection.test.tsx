import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import type { ReactNode } from 'react';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock('@/shared/lib/i18n/client', () => ({
  useT: () => ({
    t: (key: string, opts?: { returnObjects?: boolean }) => {
      if (opts?.returnObjects) {
        if (key.includes('enterprise')) return 'not-an-array'; // false ветка Array.isArray
        return ['Feature A', 'Feature B'];
      }
      if (key.includes('pro') && key.endsWith('.period')) return '/mo'; // true ветка period
      if (key.endsWith('.period')) return ''; // false ветка period
      return key;
    },
  }),
}));

vi.mock('@/features', () => ({
  InquiryModal: ({
    children,
    isOpen,
    onOpenChange,
  }: {
    children?: ReactNode;
    isOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
  }) => {
    if (isOpen === undefined) {
      return <div data-testid="footer-inquiry-modal">{children}</div>;
    }
    return (
      <div data-testid="controlled-modal" data-open={isOpen}>
        {children}
        {isOpen && <button onClick={() => onOpenChange?.(false)}>close-modal</button>}
      </div>
    );
  },
}));

vi.mock('@/shared/lib/app-url', () => ({ APP_LOGIN_URL: 'https://login.test' }));

vi.mock('@/shared/ui', () => ({
  Section: ({ children }: { children: ReactNode }) => <section>{children}</section>,
  SectionDecorator: () => null,
  SectionHeading: ({ title }: { title: string }) => <h2>{title}</h2>,
  TechCard: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  Reveal: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  AppButton: ({ children, onClick, isLink, linkTo }: any) =>
    isLink ? <a href={linkTo}>{children}</a> : <button onClick={onClick}>{children}</button>,
}));

import { PricingSection } from './PricingSection';

describe('PricingSection', () => {
  it('renders 3 pricing tiers', () => {
    render(<PricingSection />);
    ['hobby', 'pro', 'enterprise'].forEach((tier) => {
      expect(screen.getByText(`pricing.tiers.${tier}.name`)).toBeInTheDocument();
    });
  });

  it('renders features list and handles period true/false branches', () => {
    render(<PricingSection />);
    expect(screen.getAllByText('Feature A')).toHaveLength(2);
    expect(screen.getByText('/mo')).toBeInTheDocument(); // Проверка true-ветки
    const enterpriseCard = screen.getByText('pricing.tiers.enterprise.name').closest('div');
    expect(enterpriseCard).not.toHaveTextContent('Feature A');
  });

  it('opens and closes enterprise inquiry modal (covers onClick)', () => {
    render(<PricingSection />);

    expect(screen.queryByText('close-modal')).not.toBeInTheDocument();

    const enterpriseBtn = screen.getByRole('button', { name: 'pricing.tiers.enterprise.cta' });
    fireEvent.click(enterpriseBtn);

    expect(screen.getByText('close-modal')).toBeInTheDocument();

    fireEvent.click(screen.getByText('close-modal'));
    expect(screen.queryByText('close-modal')).not.toBeInTheDocument();
  });

  it('renders footer link inside InquiryModal', () => {
    render(<PricingSection />);
    expect(screen.getByTestId('footer-inquiry-modal')).toBeInTheDocument();
    expect(screen.getByText('pricing.footer.link')).toBeInTheDocument();
  });
});
