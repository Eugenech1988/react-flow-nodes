import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { Network } from 'lucide-react';
import { FeaturePlaque } from './FeaturePlaque';
import { CtaPlaque } from './CtaPlaque';
import { BackgroundArtifacts } from './BackgroundArtifacts';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock('@/shared/lib/i18n/client', () => ({
  useT: () => ({ t: (key: string) => key }),
}));

vi.mock('@/shared/lib/app-url', () => ({
  APP_LOGIN_URL: 'https://login.test',
}));

vi.mock('@/shared/ui', () => ({
  Rivets: () => <div data-testid="rivets" />,
  Badge: ({ children }: { children: React.ReactNode }) => <span data-testid="badge">{children}</span>,
  TechLabel: ({ children }: { children: React.ReactNode }) => <span data-testid="tech-label">{children}</span>,
  AppButton: ({ children, linkTo, isLink }: any) =>
    isLink ? <a href={linkTo}>{children}</a> : <button>{children}</button>,
}));

describe('Feature Plaques', () => {
  describe('FeaturePlaque', () => {
    const props = {
      title: 'Visual Editor',
      badge: 'INTERACTIVE',
      description: '<strong>HTML</strong> description',
      Icon: Network,
      number: '01',
    };

    it('renders title, number and badge', () => {
      render(<FeaturePlaque {...props} />);
      expect(screen.getByText('Visual Editor')).toBeInTheDocument();
      // Ищем полное значение с номером
      expect(screen.getByText(/№\s*01/)).toBeInTheDocument();
      expect(screen.getByText('INTERACTIVE')).toBeInTheDocument();
    });

    it('renders HTML description safely', () => {
      render(<FeaturePlaque {...props} />);
      const strongEl = screen.getByText('HTML');
      expect(strongEl.tagName).toBe('STRONG');
    });

    it('renders icon', () => {
      const { container } = render(<FeaturePlaque {...props} />);
      expect(container.querySelector('svg')).toBeInTheDocument();
    });
  });

  describe('CtaPlaque', () => {
    it('renders all text content and link', () => {
      render(<CtaPlaque />);
      expect(screen.getByText('features.cta.subtitle')).toBeInTheDocument();
      expect(screen.getByText('features.cta.title')).toBeInTheDocument();
      expect(screen.getByText('features.cta.description')).toBeInTheDocument();
      
      const link = screen.getByRole('link', { name: 'features.cta.button' });
      expect(link).toHaveAttribute('href', 'https://login.test');
    });
  });

  describe('BackgroundArtifacts', () => {
    it('renders all visual elements', () => {
      const { container } = render(<BackgroundArtifacts />);
      
      // Проверяем наличие специфичных текстов
      expect(screen.getByText('0x7F.SYS.001 //// SIGNAL.LOCKED')).toBeInTheDocument();
      expect(screen.getByText('0x7F.SYS.002 //// DATA.STREAM')).toBeInTheDocument();
      
      // Проверяем наличие точек/линий (по классам)
      expect(container.querySelectorAll('.animate-pulse').length).toBeGreaterThan(0);
      expect(container.querySelectorAll('.bg-theme-accent\\/60').length).toBeGreaterThan(0);
    });
  });
});
