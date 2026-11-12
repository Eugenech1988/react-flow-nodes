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

vi.mock('@/shared/ui', () => ({
  Section: ({ children }: { children: ReactNode }) => <section>{children}</section>,
  SectionDecorator: () => null,
  SectionHeading: ({ title }: { title: string }) => <h2>{title}</h2>,
  TechCard: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  Reveal: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  Badge: ({ children }: { children: ReactNode }) => <span>{children}</span>,
}));

import { UseCasesSection } from './UseCasesSection';
import { USE_CASES } from './constants';

describe('UseCasesSection', () => {
  it('renders heading', () => {
    render(<UseCasesSection />);
    expect(screen.getByText('useCases.heading.title')).toBeInTheDocument();
  });

  it('renders 4 use case cards', () => {
    render(<UseCasesSection />);
    USE_CASES.forEach(({ id }) => {
      expect(screen.getByText(`useCases.list.${id}.title`)).toBeInTheDocument();
    });
  });

  it('renders module IDs', () => {
    render(<UseCasesSection />);
    USE_CASES.forEach(({ id }) => {
      expect(screen.getByText(`MODULE // ${id}`)).toBeInTheDocument();
    });
  });

  it('renders secure label for each card', () => {
    render(<UseCasesSection />);
    expect(screen.getAllByText('useCases.secure')).toHaveLength(4);
  });
});
