import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { JobsListPage } from './JobListPage';

const { mockNavigate, mockUseAdminJobs } = vi.hoisted(() => ({
  mockNavigate: vi.fn(),
  mockUseAdminJobs: vi.fn(),
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock('./hooks', () => ({
  useAdminJobs: () => mockUseAdminJobs(),
}));

vi.mock('@/shared/ui', () => ({
  AppButton: ({ text, linkTo }: unknown) => <a href={linkTo}>{text}</a>,
}));

vi.mock('./components', () => ({
  JobTable: ({ jobs, onEdit, isLoading }: unknown) => (
    <div data-testid="job-table" data-loading={String(isLoading)}>
      {jobs.map((j: unknown) => (
        <button key={j.id} onClick={() => onEdit(j.id)}>
          Edit {j.id}
        </button>
      ))}
    </div>
  ),
}));

describe('JobsListPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows error state', () => {
    mockUseAdminJobs.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: { message: 'Network failed' },
    });
    render(<JobsListPage />);
    expect(screen.getByText('Failed to load jobs')).toBeInTheDocument();
    expect(screen.getByText('Network failed')).toBeInTheDocument();
  });

  it('shows error with unknown message', () => {
    mockUseAdminJobs.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: {},
    });
    render(<JobsListPage />);
    expect(screen.getByText('Unknown error')).toBeInTheDocument();
  });

  it('renders header and table', () => {
    mockUseAdminJobs.mockReturnValue({
      data: [{ id: 'j1' }],
      isLoading: false,
      isError: false,
    });
    render(<JobsListPage />);
    expect(screen.getByText('Job Vacancies')).toBeInTheDocument();
    expect(screen.getByText('New Vacancy')).toBeInTheDocument();
    expect(screen.getByTestId('job-table')).toHaveAttribute('data-loading', 'false');
  });

  it('passes loading to table', () => {
    mockUseAdminJobs.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    });
    render(<JobsListPage />);
    expect(screen.getByTestId('job-table')).toHaveAttribute('data-loading', 'true');
  });

  it('navigates to edit on row', () => {
    mockUseAdminJobs.mockReturnValue({
      data: [{ id: 'j1' }],
      isLoading: false,
      isError: false,
    });
    render(<JobsListPage />);
    fireEvent.click(screen.getByText('Edit j1'));
    expect(mockNavigate).toHaveBeenCalledWith('/admin/jobs/j1');
  });
});
