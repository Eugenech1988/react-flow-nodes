import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => '/en',
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock('@/shared/lib/i18n/server', () => ({
  getT: vi.fn(async () => ({ t: (key: string) => key })),
}));

vi.mock('@/shared/lib/i18n/client', () => ({
  useT: () => ({ t: (key: string) => key, i18n: { language: 'en' } }),
}));

vi.mock('./components', () => ({
  HeroActions: () => <div data-testid="hero-actions" />,
  LazyHeroCanvas: () => <div data-testid="lazy-canvas" />,
}));

import { HeroSection } from './HeroSection';

describe('HeroSection', () => {
  it('renders heading and subcomponents', async () => {
    render(await HeroSection());
    expect(screen.getByText('hero.title')).toBeInTheDocument();
    expect(screen.getByTestId('hero-actions')).toBeInTheDocument();
    expect(screen.getByTestId('lazy-canvas')).toBeInTheDocument();
  });
});
