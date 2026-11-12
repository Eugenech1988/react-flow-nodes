import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import type { ReactNode } from 'react';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}));

vi.mock('@/shared/lib/i18n/client', () => ({
  useT: () => ({
    t: (key: string) => key,
    i18n: { language: 'en' },
  }),
}));

vi.mock('@/shared/lib/i18n/server', () => ({
  getT: vi.fn(async () => ({ t: (key: string) => key })),
}));

vi.mock('@/shared/ui', () => ({
  Reveal: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  SectionHeading: ({ title, description }: { title: string; description?: string }) => (
    <div>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  ),
  TechCard: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  AppButton: ({ children, linkTo, isLink }: any) =>
    isLink ? <a href={linkTo}>{children}</a> : <button>{children}</button>,
  Frame: ({ children, headerTitle, footer }: any) => (
    <div>
      <div>{headerTitle}</div>
      {children}
      {footer && <div>{footer}</div>}
    </div>
  ),
}));

import { MissionSection } from './MissionSection';
import { PrinciplesSection } from './PrinciplesSection';
import { CrewSection } from './CrewSection';
import { CtaSection } from './CtaSection';
import { AboutHero } from './AboutHero';
import { AboutBackground } from './AboutBackground';
import { AboutInteractiveContent } from './AboutInteractiveContent';
import { Rivets, WindowDots } from './shared';
import { CREW, VALUES } from './constants';

describe('About Sections', () => {
  describe('MissionSection', () => {
    it('renders title and description', () => {
      render(<MissionSection />);
      expect(screen.getByText('mission.title')).toBeInTheDocument();
      expect(screen.getByText('mission.description')).toBeInTheDocument();
    });
  });

  describe('PrinciplesSection', () => {
    it('renders all values with correct numbers', () => {
      render(<PrinciplesSection />);
      VALUES.forEach(({ id, number }) => {
        expect(screen.getByText(`values.list.${id}.title`)).toBeInTheDocument();
        expect(screen.getByText(`[Phase_${number}] // Briefing`)).toBeInTheDocument();
      });
    });
  });

  describe('CrewSection', () => {
    it('renders all crew members and roles', () => {
      render(<CrewSection />);
      CREW.forEach(({ id }) => {
        expect(screen.getByText(`crew.list.${id}.name`)).toBeInTheDocument();
        expect(screen.getByText(`crew.list.${id}.role`)).toBeInTheDocument();
        expect(screen.getByAltText(`crew.list.${id}.name`)).toBeInTheDocument();
      });
    });

    it('renders correct ID formatting', () => {
      render(<CrewSection />);
      expect(screen.getByText('ID: 001-A')).toBeInTheDocument();
    });
  });

  describe('CtaSection', () => {
    it('renders title and description', () => {
      render(<CtaSection />);
      expect(screen.getByText('cta.title')).toBeInTheDocument();
      expect(screen.getByText('cta.description')).toBeInTheDocument();
    });

    it('renders link with correct locale', () => {
      render(<CtaSection />);
      const link = screen.getByRole('link', { name: 'cta.button' });
      expect(link).toHaveAttribute('href', '/en/careers');
    });
  });

  describe('AboutHero', () => {
    it('renders hero content', async () => {
      render(await AboutHero());
      expect(screen.getByText('hero.title')).toBeInTheDocument();
      expect(screen.getByText('hero.description')).toBeInTheDocument();
    });
  });

  describe('AboutBackground', () => {
    it('renders structural elements', () => {
      const { container } = render(<AboutBackground />);
      expect(container.firstChild).toHaveClass('fixed', 'inset-0');
    });
  });

  describe('AboutInteractiveContent', () => {
    it('renders all sub-sections', () => {
      render(<AboutInteractiveContent />);
      expect(screen.getByText('mission.title')).toBeInTheDocument();
      expect(screen.getByText('values.title')).toBeInTheDocument();
      expect(screen.getByText('crew.title')).toBeInTheDocument();
      expect(screen.getByText('cta.title')).toBeInTheDocument();
    });
  });

  describe('Shared Components', () => {
    it('Rivets renders 4 spans', () => {
      const { container } = render(<Rivets />);
      expect(container.querySelectorAll('span')).toHaveLength(4);
    });

    it('WindowDots renders 3 dots', () => {
      const { container } = render(<WindowDots />);
      expect(container.querySelectorAll('span')).toHaveLength(3);
    });
  });
});
