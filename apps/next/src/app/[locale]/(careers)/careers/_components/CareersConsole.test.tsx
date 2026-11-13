import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import type { TPublicJob } from '@/shared/api';
import { incrementJobViews } from '@/shared/api';
import { useScrollHint } from '@/shared/hooks';

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: mockPush }) }));
vi.mock('@/shared/lib/i18n/client', () => ({ useT: () => ({ t: (k: string) => k }) }));
vi.mock('@/shared/api', () => ({ incrementJobViews: vi.fn() }));
vi.mock('@/shared/ui', () => ({
  SectionHeading: ({ title }: any) => <h2>{title}</h2>,
  Frame: ({ children, toolbar }: any) => <div>{toolbar}{children}</div>,
}));
vi.mock('@/shared/hooks', () => ({ useScrollHint: vi.fn() }));

import { CareersConsole } from './CareersConsole';

const engineeringJob: TPublicJob = {
  id: '1', slug: 'frontend', title: 'Frontend Dev', description: 'Desc',
  responsibilities: [], requirements: [], department: 'ENGINEERING',
  level: 'SENIOR', type: 'FULL_TIME', location: 'Remote', icon: 'code-2',
  metaTitle: null, metaDescription: null, views: 10, applications: 2,
};

const designJob: TPublicJob = {
  id: '2', slug: 'designer', title: 'Designer', description: 'Desc',
  responsibilities: [], requirements: [], department: 'DESIGN',
  level: 'UNKNOWN_LEVEL', type: 'UNKNOWN_TYPE', location: 'Remote', icon: null,
  metaTitle: null, metaDescription: null, views: null as any, applications: undefined as any,
};

const scrollByMock = vi.fn();

describe('CareersConsole', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    HTMLElement.prototype.scrollBy = scrollByMock;
  });

  it('renders all jobs with numeric values and fallbacks', () => {
    vi.mocked(useScrollHint).mockReturnValue(false);
    render(<CareersConsole jobs={[engineeringJob, designJob]} locale="en" />);
    
    expect(screen.getByText('Frontend Dev')).toBeInTheDocument();
    expect(screen.getByText('Designer')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getAllByText('0').length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText('openings.types.UNKNOWN_TYPE')).toBeInTheDocument();
    expect(screen.getByText('openings.levels.UNKNOWN_LEVEL')).toBeInTheDocument();
  });

  it('toggles mobile department dropdown', () => {
    vi.mocked(useScrollHint).mockReturnValue(false);
    render(<CareersConsole jobs={[engineeringJob, designJob]} locale="en" />);

    const toggleBtn = screen.getAllByText('openings.filters.all')[0].closest('button')!;
    expect(toggleBtn).toBeInTheDocument();

    fireEvent.click(toggleBtn);
    const designOption = screen.getAllByText('openings.filters.design')[0];
    expect(designOption).toBeInTheDocument();

    fireEvent.click(designOption);
    expect(screen.getByText('Designer')).toBeInTheDocument();
    expect(screen.queryByText('Frontend Dev')).not.toBeInTheDocument();
  });

  it('filters jobs by department via desktop buttons', () => {
    vi.mocked(useScrollHint).mockReturnValue(false);
    render(<CareersConsole jobs={[engineeringJob, designJob]} locale="en" />);

    const desktopDesignBtn = screen.getAllByText('openings.filters.design')[1].closest('button')!;
    fireEvent.click(desktopDesignBtn);

    expect(screen.getByText('Designer')).toBeInTheDocument();
    expect(screen.queryByText('Frontend Dev')).not.toBeInTheDocument();
  });

  it('renders empty state when filter results in no jobs', () => {
    vi.mocked(useScrollHint).mockReturnValue(false);
    render(<CareersConsole jobs={[engineeringJob]} locale="en" />);

    const desktopDesignBtn = screen.getAllByText('openings.filters.design')[1].closest('button')!;
    fireEvent.click(desktopDesignBtn);

    expect(screen.getByText('openings.empty')).toBeInTheDocument();
  });

  it('navigates on job click', () => {
    vi.mocked(useScrollHint).mockReturnValue(false);
    vi.mocked(incrementJobViews).mockResolvedValueOnce(true);
    render(<CareersConsole jobs={[engineeringJob]} locale="en" />);

    fireEvent.click(screen.getByText('Frontend Dev').closest('a')!);
    expect(mockPush).toHaveBeenCalledWith('/en/careers/frontend');
    expect(incrementJobViews).toHaveBeenCalledWith('1', 'frontend', 'en');
  });

  it('does not navigate on modified click', () => {
    vi.mocked(useScrollHint).mockReturnValue(false);
    render(<CareersConsole jobs={[engineeringJob]} locale="en" />);

    fireEvent.click(screen.getByText('Frontend Dev').closest('a')!, { metaKey: true });
    expect(mockPush).not.toHaveBeenCalled();
    expect(incrementJobViews).not.toHaveBeenCalled();
  });

  it('handles incrementJobViews rejection', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(useScrollHint).mockReturnValue(false);
    vi.mocked(incrementJobViews).mockRejectedValueOnce(new Error('API Error'));
    render(<CareersConsole jobs={[engineeringJob]} locale="en" />);

    fireEvent.click(screen.getByText('Frontend Dev').closest('a')!);
    
    await waitFor(() => {
      expect(spy).toHaveBeenCalledWith('Failed to increment views', expect.any(Error));
    });
    spy.mockRestore();
  });

  it('shows More button and calls scrollBy', () => {
    vi.mocked(useScrollHint).mockReturnValue(true);
    render(<CareersConsole jobs={[engineeringJob]} locale="en" />);

    const moreBtn = screen.getByText('More');
    expect(moreBtn).toBeInTheDocument();

    fireEvent.click(moreBtn);
    expect(scrollByMock).toHaveBeenCalledWith({ top: 220, behavior: 'smooth' });
  });

  it('does not render More when hint is false', () => {
    vi.mocked(useScrollHint).mockReturnValue(false);
    render(<CareersConsole jobs={[engineeringJob]} locale="en" />);

    expect(screen.queryByText('More')).not.toBeInTheDocument();
  });

  it('renders long job titles with break-words class', () => {
    const longTitleJob = {
      ...engineeringJob,
      title: 'SuperExtremelyLongJobTitleWithoutAnySpacesThatShouldNotBreakLayout',
    };
    
    vi.mocked(useScrollHint).mockReturnValue(false);
    render(<CareersConsole jobs={[longTitleJob]} locale="en" />);

    const title = screen.getByText('SuperExtremelyLongJobTitleWithoutAnySpacesThatShouldNotBreakLayout');
    expect(title).toHaveClass('wrap-break-word');
  });
});
