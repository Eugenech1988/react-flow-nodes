import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

vi.mock('@/shared/lib/i18n/client', () => ({
  useT: () => ({ t: (key: string) => key }),
}));

vi.mock('@/shared/ui', () => ({
  SectionHeading: ({ title }: any) => <h2>{title}</h2>,
  Reveal: ({ children }: any) => <div>{children}</div>,
}));

vi.mock('@/widgets/careers-ui', () => ({
  TornPaperCard: ({ title }: any) => <div>{title}</div>,
}));

import { CareersPerks } from './CareersPerks';
import { PERKS } from '../constants';

describe('CareersPerks', () => {
  it('renders heading and all perks', () => {
    render(<CareersPerks />);
    expect(screen.getByText('perks.heading.title')).toBeInTheDocument();
    PERKS.forEach((perk) => {
      expect(screen.getByText(`perks.list.${perk.id}.title`)).toBeInTheDocument();
    });
  });
});
