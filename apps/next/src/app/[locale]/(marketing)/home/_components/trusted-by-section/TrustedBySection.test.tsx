import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

vi.mock('@/shared/lib/i18n/client', () => ({
  useT: () => ({ t: (key: string) => key }),
}));

import { TrustedBySection } from './TrustedBySection';
import { COMPANIES } from './constants';

describe('TrustedBySection', () => {
  it('renders heading', () => {
    render(<TrustedBySection />);
    expect(screen.getByText('trustedBy.heading.title')).toBeInTheDocument();
  });

  it('renders all companies duplicated for marquee', () => {
    render(<TrustedBySection />);
    COMPANIES.forEach((company) => {
      expect(screen.getAllByText(company.name)).toHaveLength(2);
    });
  });
});
