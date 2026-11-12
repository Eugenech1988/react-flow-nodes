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
  Frame: ({ children, toolbar }: any) => (
    <div>
      {toolbar}
      {children}
    </div>
  ),
}));
vi.mock('@/shared/hooks', () => ({ useScrollHint: vi.fn() }));

import { CareersConsole } from './CareersConsole';

const fullJob: TPublicJob = {
  id: '1',
  slug: 'frontend',
  title: 'Frontend Dev',
  description: 'Desc',
  responsibilities: [],
  requirements: [],
  department: 'ENGINEERING',
  level: 'SENIOR',
  type: 'FULL_TIME',
  location: 'Remote',
  icon: 'code-2',
  metaTitle: null,
  metaDescription: null,
  views: 10,
  applications: 2,
};

const jobWithNulls = {
  id: '2',
  slug: 'mystery',
  title: 'Mystery',
  description: 'Desc',
  responsibilities: [],
  requirements: [],
  department: 'DESIGN',
  level: 'UNKNOWN_LEVEL',
  type: 'UNKNOWN_TYPE',
  location: 'Remote',
  icon: null,
  metaTitle: null,
  metaDescription: null,
  views: null,
  applications: undefined,
} as unknown as TPublicJob;

const scrollByMock = vi.fn();

describe('CareersConsole', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    HTMLElement.prototype.scrollBy = scrollByMock;
  });

  it('renders jobs with numeric values', () => {
    vi.mocked(useScrollHint).mockReturnValue(false);
    render(<CareersConsole jobs={[fullJob]} locale="en" />);
    expect(screen.getByText('Frontend Dev')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('handles null views/applications and unknown type/level', () => {
    vi.mocked(useScrollHint).mockReturnValue(false);
    render(<CareersConsole jobs={[jobWithNulls]} locale="en" />);
    expect(screen.getByText('Mystery')).toBeInTheDocument();
    const zeros = screen.getAllByText('0');
    expect(zeros.length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText('openings.types.UNKNOWN_TYPE')).toBeInTheDocument();
    expect(screen.getByText('openings.levels.UNKNOWN_LEVEL')).toBeInTheDocument();
  });

  it('filters by department', () => {
    vi.mocked(useScrollHint).mockReturnValue(false);
    render(<CareersConsole jobs={[fullJob, jobWithNulls]} locale="en" />);
    fireEvent.click(screen.getByText('openings.filters.design'));
    expect(screen.getByText('Mystery')).toBeInTheDocument();
    expect(screen.queryByText('Frontend Dev')).not.toBeInTheDocument();
  });

  it('renders empty state', () => {
    vi.mocked(useScrollHint).mockReturnValue(false);
    render(<CareersConsole jobs={[]} locale="en" />);
    expect(screen.getByText('openings.empty')).toBeInTheDocument();
  });

  it('navigates on click', () => {
    vi.mocked(useScrollHint).mockReturnValue(false);
    vi.mocked(incrementJobViews).mockResolvedValueOnce(true);
    render(<CareersConsole jobs={[fullJob]} locale="en" />);
    fireEvent.click(screen.getByText('Frontend Dev').closest('a')!);
    expect(mockPush).toHaveBeenCalledWith('/en/careers/frontend');
  });

  it('does not navigate on modified click', () => {
    vi.mocked(useScrollHint).mockReturnValue(false);
    render(<CareersConsole jobs={[fullJob]} locale="en" />);
    fireEvent.click(screen.getByText('Frontend Dev').closest('a')!, { metaKey: true });
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('handles incrementJobViews rejection', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(useScrollHint).mockReturnValue(false);
    vi.mocked(incrementJobViews).mockRejectedValueOnce(new Error('API Error'));
    render(<CareersConsole jobs={[fullJob]} locale="en" />);
    fireEvent.click(screen.getByText('Frontend Dev').closest('a')!);
    await waitFor(() => {
      expect(spy).toHaveBeenCalledWith('Failed to increment views', expect.any(Error));
    });
    spy.mockRestore();
  });

  it('renders More button and calls scrollBy', () => {
    vi.mocked(useScrollHint).mockReturnValue(true);
    render(<CareersConsole jobs={[fullJob]} locale="en" />);
    fireEvent.click(screen.getByText('More'));
    expect(scrollByMock).toHaveBeenCalledWith({ top: 220, behavior: 'smooth' });
  });

  it('does not render More when hint is false', () => {
    vi.mocked(useScrollHint).mockReturnValue(false);
    render(<CareersConsole jobs={[fullJob]} locale="en" />);
    expect(screen.queryByText('More')).not.toBeInTheDocument();
  });
});
