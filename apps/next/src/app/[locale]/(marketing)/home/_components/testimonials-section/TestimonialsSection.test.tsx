import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import type { ReactNode } from 'react';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock('@/shared/lib/i18n/client', () => ({
  useT: () => ({ t: (key: string) => key }),
}));

vi.mock('@/features', () => ({
  InquiryModal: ({ children }: { children: ReactNode }) => (
    <div data-testid="inquiry-modal">{children}</div>
  ),
}));

vi.mock('@/shared/ui', () => ({
  Section: ({ children }: { children: ReactNode }) => <section>{children}</section>,
  SectionDecorator: () => null,
  SectionHeading: ({ title, description }: { title: string; description?: string }) => (
    <div>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  ),
  TechCard: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  Reveal: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  AppButton: ({ children }: { children: ReactNode }) => <button>{children}</button>,
}));

import { TestimonialsSection } from './TestimonialsSection';
import { TESTIMONIALS_DATA } from './constants';

describe('TestimonialsSection', () => {
  it('renders heading and description', () => {
    render(<TestimonialsSection />);
    expect(screen.getByText('testimonials.heading.title')).toBeInTheDocument();
    expect(screen.getByText('testimonials.heading.description')).toBeInTheDocument();
  });

  it('renders 3 testimonial cards', () => {
    render(<TestimonialsSection />);
    TESTIMONIALS_DATA.forEach(({ id }) => {
      expect(screen.getByText(`testimonials.list.${id}.author`)).toBeInTheDocument();
      expect(
        screen.getByText(new RegExp(`testimonials\\.list\\.${id}\\.role`)),
      ).toBeInTheDocument();
      expect(
        screen.getByText(new RegExp(`testimonials\\.list\\.${id}\\.company`)),
      ).toBeInTheDocument();
    });
  });

  it('renders initials for each testimonial', () => {
    render(<TestimonialsSection />);
    TESTIMONIALS_DATA.forEach(({ initials }) => {
      expect(screen.getByText(initials)).toBeInTheDocument();
    });
  });

  it('renders CTA button inside InquiryModal', () => {
    render(<TestimonialsSection />);
    expect(screen.getByTestId('inquiry-modal')).toBeInTheDocument();
    expect(screen.getByText('testimonials.cta')).toBeInTheDocument();
  });
});
