import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

vi.mock('@/shared/lib/i18n/client', () => ({
  useT: () => ({ t: (key: string) => key }),
}));

describe('CareersGauge', () => {
  it('renders 0 when value is 0', async () => {
    const { CareersGauge } = await import('./CareersGauge');
    render(<CareersGauge value={0} />);
    expect(screen.getByText('hero.badge.label')).toBeInTheDocument();
  });

  it('applies is-active class when value > 0', async () => {
    const { CareersGauge } = await import('./CareersGauge');
    const { container } = render(<CareersGauge value={5} />);
    expect(container.querySelector('.careers-gauge')).toHaveClass('is-active');
  });

  it('calculates target angle based on value', async () => {
    const { CareersGauge } = await import('./CareersGauge');
    const { container } = render(<CareersGauge value={25} />);
    const gauge = container.querySelector('.careers-gauge') as HTMLElement;
    expect(gauge.style.getPropertyValue('--target-value')).toBe('25');
  });

  it('handles MAX_VACANCIES <= 0 gracefully', async () => {
    vi.resetModules();
    vi.doMock('../constants', () => ({ MAX_VACANCIES: 0, TICKS: [], RIVETS: [] }));
    const { CareersGauge } = await import('./CareersGauge');
    const { container } = render(<CareersGauge value={10} />);
    const gauge = container.querySelector('.careers-gauge') as HTMLElement;
    expect(gauge.style.getPropertyValue('--target-angle')).toBe('-135deg');
    vi.doUnmock('../constants');
  });
});
