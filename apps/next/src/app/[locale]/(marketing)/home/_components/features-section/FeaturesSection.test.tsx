import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';

const mockGoToStep = vi.fn();
const mockUseFeaturesScroll = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock('@/shared/lib/i18n/client', () => ({
  useT: () => ({ t: (key: string) => key }),
}));

vi.mock('./hooks', () => ({
  useFeaturesScroll: () => mockUseFeaturesScroll(),
}));

vi.mock('./components', () => ({
  FeaturePlaque: ({ title }: { title: string }) => <div>{title}</div>,
  CtaPlaque: () => <div data-testid="cta-plaque">CTA</div>,
  BackgroundArtifacts: () => null,
}));

import { FeaturesSection } from './FeaturesSection';
import { TOTAL_STEPS } from './constants';

describe('FeaturesSection', () => {
  beforeEach(() => {
    mockUseFeaturesScroll.mockReturnValue({
      wrapperRef: { current: null },
      index: 0,
      ready: true,
      goToStep: mockGoToStep,
    });
  });

  it('renders heading', () => {
    render(<FeaturesSection />);
    expect(screen.getByText('features.heading.title')).toBeInTheDocument();
  });

  it('renders correct number of step buttons', () => {
    render(<FeaturesSection />);
    expect(screen.getAllByRole('button', { name: /features.stepLabel/ })).toHaveLength(TOTAL_STEPS);
  });

  it('highlights the first step by default', () => {
    render(<FeaturesSection />);
    expect(screen.getAllByRole('button', { name: /features.stepLabel/ })[0]).toHaveAttribute('aria-current', 'step');
  });

  it('renders active slide content', () => {
    render(<FeaturesSection />);
    expect(screen.getByText('features.list.visual-editor.title')).toBeInTheDocument();
  });

  it('calls goToStep on dot click', async () => {
    const user = userEvent.setup();
    render(<FeaturesSection />);
    await user.click(screen.getAllByRole('button', { name: /features.stepLabel/ })[2]);
    expect(mockGoToStep).toHaveBeenCalledWith(2);
  });

  it('applies lg:opacity-0 when not ready', () => {
    mockUseFeaturesScroll.mockReturnValue({ wrapperRef: { current: null }, index: 0, ready: false, goToStep: mockGoToStep });
    const { container } = render(<FeaturesSection />);
    expect(container.querySelector('.lg\\:opacity-0')).toBeInTheDocument();
  });

  it('renders past states and CTA slide when index > 0', () => {
    mockUseFeaturesScroll.mockReturnValue({ wrapperRef: { current: null }, index: TOTAL_STEPS - 1, ready: true, goToStep: mockGoToStep });
    render(<FeaturesSection />);
    expect(screen.getByTestId('cta-plaque')).toBeInTheDocument();
    
    // Проверяем, что для прошлых шагов применяются классы isPast
    const pastElements = document.querySelectorAll('.-translate-y-30');
    expect(pastElements.length).toBeGreaterThanOrEqual(1);
  });
});
