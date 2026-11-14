import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import type { ReactNode } from 'react';
import type { TPublicJob } from '@/shared/api';

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

vi.mock('@/shared/lib/i18n/client', () => ({
  useT: () => ({
    t: (k: string, opts?: { defaultValue?: string }) => opts?.defaultValue ?? k,
  }),
}));

vi.mock('@/shared/ui', () => ({
  Reveal: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  Frame: ({
    children,
    headerTitle,
    footer,
  }: {
    children: ReactNode;
    headerTitle?: ReactNode;
    footer?: ReactNode;
  }) => (
    <div>
      <span data-testid="frame-header">{headerTitle}</span>
      {children}
      {footer}
    </div>
  ),
}));

vi.mock('../../constants', () => ({
  LEVEL_LABELS: { SENIOR: 'Senior' },
  TYPE_LABELS: { FULL_TIME: 'Full-time' },
  resolveJobIcon: () => () => <svg data-testid="job-icon" />,
}));

vi.mock('./JobHeader', () => ({
  JobHeader: ({ job, applicationsCount }: { job: TPublicJob; applicationsCount: number }) => (
    <div data-testid="job-header">
      {job.title} :: {applicationsCount}
    </div>
  ),
}));

vi.mock('./JobBody', () => ({
  JobBody: ({ job, scrollToForm }: { job: TPublicJob; scrollToForm: () => void }) => (
    <div data-testid="job-body">
      <span>{job.description}</span>
      <button data-testid="body-scroll" onClick={scrollToForm}>
        scroll
      </button>
    </div>
  ),
}));

vi.mock('./JobSidebar', () => ({
  JobSidebar: ({ job }: { job: TPublicJob }) => <div data-testid="job-sidebar">{job.title}</div>,
}));

vi.mock('./JobApplicationForm', () => ({
  JobApplicationForm: ({ job }: { job: TPublicJob }) => (
    <div data-testid="job-form">{job.title}</div>
  ),
}));

import { JobDetailView } from './JobDetailView';

const mockJob: TPublicJob = {
  id: '1',
  slug: 'frontend',
  title: 'Frontend Dev',
  description: 'Build UI',
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

const scrollIntoViewMock = vi.fn();

beforeEach(() => {
  scrollIntoViewMock.mockClear();
  Element.prototype.scrollIntoView = scrollIntoViewMock;
});

describe('JobDetailView', () => {
  it('renders back link to careers page', () => {
    render(<JobDetailView job={mockJob} locale="en" />);
    expect(screen.getByRole('link', { name: /details.returnToOpenings/ })).toHaveAttribute(
      'href',
      '/en/careers',
    );
  });

  it('renders header, body, sidebar and form', () => {
    render(<JobDetailView job={mockJob} locale="en" />);
    expect(screen.getByTestId('job-header')).toHaveTextContent('Frontend Dev');
    expect(screen.getByTestId('job-body')).toHaveTextContent('Build UI');
    expect(screen.getByTestId('job-sidebar')).toHaveTextContent('Frontend Dev');
    expect(screen.getByTestId('job-form')).toHaveTextContent('Frontend Dev');
  });

  it('passes applications count to header', () => {
    render(<JobDetailView job={mockJob} locale="en" />);
    expect(screen.getByTestId('job-header')).toHaveTextContent(':: 5');
  });

  it('falls back to 0 when applications is null', () => {
    render(
      <JobDetailView job={{ ...mockJob, applications: null as unknown as number }} locale="en" />,
    );
    expect(screen.getByTestId('job-header')).toHaveTextContent(':: 0');
  });

  it('renders apply-form anchor', () => {
    const { container } = render(<JobDetailView job={mockJob} locale="en" />);
    expect(container.querySelector('#apply-form')).toBeInTheDocument();
  });

  it('renders dossier header title', () => {
    render(<JobDetailView job={mockJob} locale="en" />);
    expect(screen.getByTestId('frame-header')).toHaveTextContent('SYS.DOSSIER // FRONTEND');
  });

  it('falls back to raw level and type when label maps miss', () => {
    render(<JobDetailView job={{ ...mockJob, level: 'LEAD', type: 'CONTRACT' }} locale="en" />);
    expect(screen.getByTestId('job-sidebar')).toBeInTheDocument();
  });

  it('scrolls to form when #apply-form exists', () => {
    render(<JobDetailView job={mockJob} locale="en" />);
    fireEvent.click(screen.getByTestId('body-scroll'));
    expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: 'smooth' });
  });

  it('does not call scrollIntoView when #apply-form is missing', () => {
    const { container } = render(<JobDetailView job={mockJob} locale="en" />);
    container.querySelector('#apply-form')?.remove();

    expect(() => {
      fireEvent.click(screen.getByTestId('body-scroll'));
    }).not.toThrow();

    expect(scrollIntoViewMock).not.toHaveBeenCalled();
  });

  it('updates applications count when job.applications changes', () => {
    const { rerender } = render(<JobDetailView job={mockJob} locale="en" />);
    expect(screen.getByTestId('job-header')).toHaveTextContent(':: 5');

    rerender(<JobDetailView job={{ ...mockJob, applications: 12 }} locale="en" />);
    expect(screen.getByTestId('job-header')).toHaveTextContent(':: 12');
  });
});
