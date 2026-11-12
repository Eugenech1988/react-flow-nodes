import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

vi.mock('@/shared/lib/i18n/client', () => ({
  useT: () => ({ t: (key: string) => key }),
}));

vi.mock('@/shared/ui', () => ({
  SectionHeading: ({ title, description }: any) => (
    <div>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  ),
}));

import { CareersHero } from './CareersHero';

describe('CareersHero', () => {
  const t = ((key: string) => key) as any;

  it('renders title, description and gauge', () => {
    render(<CareersHero total={10} t={t} />);
    expect(screen.getByText('hero.title')).toBeInTheDocument();
    expect(screen.getByText('hero.description')).toBeInTheDocument();
    expect(screen.getByText('hero.badge.label')).toBeInTheDocument();
  });
});
