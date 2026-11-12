import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import type { ReactNode } from 'react';

vi.mock('@/shared/lib/i18n/client', () => ({
  useT: () => ({ t: (key: string) => key }),
}));

vi.mock('@/shared/lib/app-url', () => ({
  APP_LOGIN_URL: 'https://login.test',
}));

vi.mock('@/shared/ui', () => ({
  Section: ({ children }: { children: ReactNode }) => <section>{children}</section>,
  SectionDecorator: () => null,
  SectionHeading: ({ title }: { title: string }) => <h2>{title}</h2>,
  AppButton: ({ children, isLink, linkTo }: any) =>
    isLink ? <a href={linkTo}>{children}</a> : <button>{children}</button>,
  Frame: ({ children, headerTitle, footer }: any) => (
    <div>
      <div>{headerTitle}</div>
      {children}
      {footer}
    </div>
  ),
}));

import { HowItWorksSection } from './HowItWorksSection';

describe('HowItWorksSection', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('renders heading', () => {
    render(<HowItWorksSection />);
    expect(screen.getByText('howItWorks.heading.title')).toBeInTheDocument();
  });

  it('triggers loading state on step click and advances after 600ms', () => {
    render(<HowItWorksSection />);
    const deployTitle = screen.getAllByText('howItWorks.steps.deploy.title')[0];
    fireEvent.click(deployTitle.closest('button')!);

    expect(screen.getByText('Initializing Module...')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(600);
    });

    const activeButtons = screen.getAllByRole('button', { pressed: true });
    expect(
      activeButtons.some((btn) => btn.textContent?.includes('howItWorks.steps.deploy.title')),
    ).toBe(true);
  });

  it('clears previous timeout when clicking another step quickly', () => {
    render(<HowItWorksSection />);

    const deployBtn = screen.getAllByText('howItWorks.steps.deploy.title')[0].closest('button')!;
    const monitorBtn = screen.getAllByText('howItWorks.steps.monitor.title')[0].closest('button')!;

    fireEvent.click(deployBtn);
    expect(screen.getByText('Initializing Module...')).toBeInTheDocument();

    fireEvent.click(monitorBtn);

    act(() => {
      vi.advanceTimersByTime(600);
    });

    const activeButtons = screen.getAllByRole('button', { pressed: true });
    expect(
      activeButtons.some((btn) => btn.textContent?.includes('howItWorks.steps.monitor.title')),
    ).toBe(true);
  });

  it('ignores click on already active step', () => {
    render(<HowItWorksSection />);
    const designTitle = screen.getAllByText('howItWorks.steps.design.title')[0];
    fireEvent.click(designTitle.closest('button')!);

    const loaderContainer = screen.getByText('Initializing Module...').closest('[aria-hidden]');
    expect(loaderContainer).toHaveAttribute('aria-hidden', 'true');
  });

  it('handles click on mobile step buttons', () => {
    render(<HowItWorksSection />);
    const mobileBtn = screen.getAllByLabelText('howItWorks.steps.deploy.title')[0];
    fireEvent.click(mobileBtn);
    expect(screen.getByText('Initializing Module...')).toBeInTheDocument();
  });

  it('clears timeout on unmount', () => {
    const { unmount } = render(<HowItWorksSection />);
    const deployTitle = screen.getAllByText('howItWorks.steps.deploy.title')[0];
    fireEvent.click(deployTitle.closest('button')!);
    unmount();
  });

  it('renders CTA button with link', () => {
    render(<HowItWorksSection />);
    expect(screen.getByRole('link', { name: 'howItWorks.cta' })).toHaveAttribute(
      'href',
      'https://login.test',
    );
  });
});
