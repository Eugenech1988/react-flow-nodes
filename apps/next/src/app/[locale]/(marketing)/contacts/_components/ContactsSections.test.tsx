import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import type { ReactNode } from 'react';

// --- MOCKS ---
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
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

vi.mock('@/entities/inquiry/InquiryForm', () => ({
  InquiryForm: () => <div data-testid="inquiry-form" />,
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
  Frame: ({ children, headerTitle, footer }: any) => (
    <div>
      <div>{headerTitle}</div>
      {children}
      {footer && <div>{footer}</div>}
    </div>
  ),
  Rivets: () => null,
  SocialLinks: () => <div data-testid="social-links" />,
}));

// --- COMPONENTS ---
import { ContactsContent } from './ContactsContent';
import { ContactsHero } from './ContactsHero';
import { ContactsBackground } from './ContactsBackground';
import { CONTACT_CHANNELS, RADAR_BLIPS } from '../constants';

describe('Contacts Sections', () => {
  describe('ContactsHero', () => {
    it('renders hero content', async () => {
      render(await ContactsHero());
      expect(screen.getByText('hero.title')).toBeInTheDocument();
      expect(screen.getByText('hero.description')).toBeInTheDocument();
    });
  });

  describe('ContactsBackground', () => {
    it('renders structural elements', () => {
      const { container } = render(<ContactsBackground />);
      expect(container.firstChild).toHaveClass('fixed', 'inset-0');
    });
  });

  describe('ContactsContent', () => {
    it('renders all contact channels', () => {
      render(<ContactsContent />);
      CONTACT_CHANNELS.forEach(({ id, href }) => {
        expect(screen.getByText(`channels.${id}.label`)).toBeInTheDocument();
        expect(screen.getByText(`channels.${id}.value`).closest('a')).toHaveAttribute('href', href);
      });
    });

    it('renders radar title and footer', () => {
      render(<ContactsContent />);
      expect(screen.getByText('radar.title')).toBeInTheDocument();
      expect(screen.getByText('radar.signal')).toBeInTheDocument();
      expect(screen.getByText('radar.coordinates')).toBeInTheDocument();
    });

    it('renders radar blips', () => {
      const { container } = render(<ContactsContent />);
      const blips = container.querySelectorAll('.animate-ping');
      expect(blips).toHaveLength(RADAR_BLIPS.length);
    });

    it('renders inquiry form and socials', () => {
      render(<ContactsContent />);
      expect(screen.getByTestId('inquiry-form')).toBeInTheDocument();
      expect(screen.getByTestId('social-links')).toBeInTheDocument();
      expect(screen.getByText('form.title')).toBeInTheDocument();
    });
  });
});
