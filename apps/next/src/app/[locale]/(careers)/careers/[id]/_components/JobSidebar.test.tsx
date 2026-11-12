import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import type { TPublicJob } from '@/shared/api';
import { Cog } from 'lucide-react';

vi.mock('@/shared/lib/i18n/client', () => ({
  useT: () => ({
    t: (key: string, opts?: { defaultValue?: string }) => opts?.defaultValue ?? key,
  }),
}));

vi.mock('@/shared/ui', () => ({
  Frame: ({ children }: any) => <div>{children}</div>,
  Reveal: ({ children }: any) => <div>{children}</div>,
  AppButton: ({ children, onClick }: any) => <button onClick={onClick}>{children}</button>,
}));

import { JobSidebar } from './JobSidebar';

const knownJob: TPublicJob = {
  id: '1',
  slug: 'job',
  title: 'Frontend',
  description: '',
  responsibilities: [],
  requirements: [],
  department: 'ENGINEERING',
  level: 'SENIOR',
  type: 'FULL_TIME',
  location: 'Remote',
  icon: null,
  metaTitle: null,
  metaDescription: null,
  views: 10,
  applications: 5,
};

const unknownJob = {
  ...knownJob,
  level: 'UNKNOWN_LEVEL',
  views: null,
  applications: null,
} as unknown as TPublicJob;

describe('JobSidebar', () => {
  it('renders with known level and numeric counters', () => {
    render(<JobSidebar job={knownJob} Icon={Cog} scrollToForm={vi.fn()} />);
    expect(screen.getByText('Remote')).toBeInTheDocument();
    expect(screen.getByText('details.sidebar.title')).toBeInTheDocument();
  });

  it('falls back to raw level and 0 counters', () => {
    render(<JobSidebar job={unknownJob} Icon={Cog} scrollToForm={vi.fn()} />);
    expect(screen.getByText('UNKNOWN_LEVEL')).toBeInTheDocument();
    expect(screen.getByText('details.views')).toBeInTheDocument();
    expect(screen.getByText('details.applications')).toBeInTheDocument();
  });

  it('calls scrollToForm when CTA button is clicked', () => {
    const scrollToForm = vi.fn();
    render(<JobSidebar job={knownJob} Icon={Cog} scrollToForm={scrollToForm} />);
    fireEvent.click(screen.getByText('details.initiateApplication'));
    expect(scrollToForm).toHaveBeenCalled();
  });
});
