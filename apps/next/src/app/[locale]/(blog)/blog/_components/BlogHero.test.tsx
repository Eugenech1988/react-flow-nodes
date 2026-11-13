import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import type { TFunction } from 'i18next';

vi.mock('@/shared/ui', () => ({
  SectionHeading: ({ title, description }: { title: string; description: string }) => (
    <div>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  ),
}));

import { BlogHero } from './BlogHero';

const t = ((key: string) => key) as unknown as TFunction<'blog'>;

describe('BlogHero', () => {
  it('renders title and description', () => {
    render(<BlogHero t={t} total={5} lastUpdate="2024.01.01" />);
    expect(screen.getByText('hero.title')).toBeInTheDocument();
    expect(screen.getByText('hero.description')).toBeInTheDocument();
  });

  it('renders status and entries', () => {
    render(<BlogHero t={t} total={5} lastUpdate="2024.01.01" />);
    expect(screen.getByText('hero.status')).toBeInTheDocument();
    expect(screen.getByText('hero.entries')).toBeInTheDocument();
  });

  it('renders last update value', () => {
    render(<BlogHero t={t} total={5} lastUpdate="2024.01.01" />);
    expect(screen.getByText(/2024\.01\.01/)).toBeInTheDocument();
  });
});
