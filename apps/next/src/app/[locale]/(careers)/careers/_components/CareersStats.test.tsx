import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

vi.mock('@/shared/lib/i18n/client', () => ({
  useT: () => ({ t: (key: string) => key }),
}));

vi.mock('@/widgets/careers-ui', () => ({
  ChamferedCard: ({ children }: any) => <div>{children}</div>,
}));

vi.mock('./CareersOdometer', () => ({
  Odometer: ({ value }: any) => <span>{value}</span>,
}));

import { CareersStats } from './CareersStats';
import { CAREERS_STATS } from '../constants';

describe('CareersStats', () => {
  it('renders all stats', () => {
    render(<CareersStats />);
    CAREERS_STATS.forEach((stat) => {
      expect(screen.getByText(`stats.list.${stat.id}.value`)).toBeInTheDocument();
      expect(screen.getByText(`stats.list.${stat.id}.label`)).toBeInTheDocument();
    });
  });
});
