import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import type { ReactNode } from 'react';
import type { TPublicJob } from '@/shared/api';

vi.mock('@/shared/lib/i18n/client', () => ({
  useT: () => ({
    t: (key: string, opts?: { count?: number; length?: number }) => {
      if (key === 'details.ref') return `REF: 00${opts?.length ?? 0}-A`;
      if (key === 'details.views') return `${opts?.count ?? 0} Views`;
      if (key === 'details.applications') return `${opts?.count ?? 0} Applications`;
      return key;
    },
  }),
}));

vi.mock('@/shared/ui', () => ({
  Badge: ({ children }: { children: ReactNode }) => <span data-testid="badge">{children}</span>,
}));

import { JobHeader } from './JobHeader';

const mockJob: TPublicJob = {
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
  icon: null,
  metaTitle: null,
  metaDescription: null,
  views: 10,
  applications: 5,
};

const renderHeader = (overrides: Partial<TPublicJob> = {}, applicationsCount = 5) =>
  render(
    <JobHeader
      job={{ ...mockJob, ...overrides }}
      deptLabel="Engineering"
      typeLabel="Full-time"
      levelLabel="Senior"
      applicationsCount={applicationsCount}
    />,
  );

describe('JobHeader', () => {
  it('renders dept badge, ref and title', () => {
    renderHeader();
    expect(screen.getByTestId('badge')).toHaveTextContent('Engineering');
    expect(screen.getByText('REF: 008-A')).toBeInTheDocument();
    expect(screen.getByText('Frontend Dev')).toBeInTheDocument();
  });

  it('renders location, type and level', () => {
    renderHeader();
    expect(screen.getByText('Remote')).toBeInTheDocument();
    expect(screen.getByText('Full-time')).toBeInTheDocument();
    expect(screen.getByText('Senior')).toBeInTheDocument();
  });

  it('renders views and applications', () => {
    renderHeader();
    expect(screen.getByText('10 Views')).toBeInTheDocument();
    expect(screen.getByText('5 Applications')).toBeInTheDocument();
  });

  it('falls back to 0 views when null', () => {
    renderHeader({ views: null as unknown as number });
    expect(screen.getByText('0 Views')).toBeInTheDocument();
  });

  it('uses provided applicationsCount over job.applications', () => {
    renderHeader({}, 42);
    expect(screen.getByText('42 Applications')).toBeInTheDocument();
  });
});
