import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import type { TPublicJob } from '@/shared/api';
import { submitJobApplication } from '@/shared/api/applications';

vi.mock('@/shared/lib/i18n/client', () => ({ useT: () => ({ t: (k: string) => k }) }));
vi.mock('@/shared/api/applications', () => ({ submitJobApplication: vi.fn() }));
vi.mock('@/shared/ui', () => ({
  Frame: ({ children }: any) => <div data-testid="frame">{children}</div>,
  AppButton: ({ children, type, isPending, pendingText }: any) => (
    <button type={type} disabled={isPending}>
      {isPending ? pendingText : children}
    </button>
  ),
  AppInput: React.forwardRef(({ error, theme, ...props }: any, ref) => (
    <input {...props} ref={ref} />
  )),
  AppLabel: ({ children, htmlFor }: any) => <label htmlFor={htmlFor}>{children}</label>,
  AppTextarea: React.forwardRef(({ error, theme, ...props }: any, ref) => (
    <textarea {...props} ref={ref} />
  )),
}));

vi.mock('@pipeline/contracts', async () => {
  const { z } = await import('zod');
  return {
    jobApplicationInputSchema: z.object({
      jobId: z.string(),
      name: z.string(),
      email: z.string(),
      position: z.string(),
      company: z.string(),
      message: z.string().optional(),
      resume: z.any().optional(),
      coverLetterFile: z.any().optional(),
    }),
  };
});

class MockFileList extends Array<File> {
  item(i: number) {
    return this[i];
  }
}
vi.stubGlobal('FileList', MockFileList);

import { JobApplicationForm } from './JobApplicationForm';

const mockJob: TPublicJob = {
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

const fillBaseFields = (opts?: { resume?: boolean; message?: string }) => {
  fireEvent.change(screen.getByLabelText('applicationForm.labels.name'), {
    target: { value: 'John Doe' },
  });
  fireEvent.change(screen.getByLabelText('applicationForm.labels.email'), {
    target: { value: 'john@test.com' },
  });
  fireEvent.change(screen.getByLabelText('applicationForm.labels.position'), {
    target: { value: 'Dev' },
  });
  fireEvent.change(screen.getByLabelText('applicationForm.labels.company'), {
    target: { value: 'Acme' },
  });

  if (opts?.resume !== false) {
    const file = new File(['resume'], 'resume.pdf', { type: 'application/pdf' });
    const input = screen.getByLabelText('applicationForm.labels.resume') as HTMLInputElement;
    Object.defineProperty(input, 'files', { value: new MockFileList(file) });
    fireEvent.change(input);
  }

  if (opts?.message) {
    fireEvent.change(screen.getByLabelText('applicationForm.labels.coverLetter'), {
      target: { value: opts.message },
    });
  }
};

const getForm = () => screen.getByText('applicationForm.buttons.submit').closest('form')!;

describe('JobApplicationForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders initial form (write mode default)', () => {
    render(<JobApplicationForm job={mockJob} locale="en" setApplicationsCount={vi.fn()} />);
    expect(screen.getByTestId('frame')).toBeInTheDocument();
    expect(screen.getByLabelText('applicationForm.labels.coverLetter')).toHaveAttribute(
      'rows',
      '4',
    );
  });

  it('switches cover letter modes', async () => {
    render(<JobApplicationForm job={mockJob} locale="en" setApplicationsCount={vi.fn()} />);
    await userEvent.click(screen.getByText('applicationForm.buttons.upload'));
    expect(screen.getByLabelText('applicationForm.labels.coverLetter').tagName).toBe('INPUT');
    await userEvent.click(screen.getByText('applicationForm.buttons.write'));
    expect(screen.getByLabelText('applicationForm.labels.coverLetter').tagName).toBe('TEXTAREA');
  });

  it('submits with message', async () => {
    vi.mocked(submitJobApplication).mockResolvedValue(true);
    render(<JobApplicationForm job={mockJob} locale="en" setApplicationsCount={vi.fn()} />);
    fillBaseFields({ message: 'My cover letter' });
    fireEvent.submit(getForm());
    await waitFor(() => expect(submitJobApplication).toHaveBeenCalled());

    const formData = vi.mocked(submitJobApplication).mock.calls[0][0];
    expect(formData.get('message')).toBe('My cover letter');
    expect(formData.get('resume')).toBeInstanceOf(File);
  });

  it('submits without message', async () => {
    vi.mocked(submitJobApplication).mockResolvedValue(true);
    render(<JobApplicationForm job={mockJob} locale="en" setApplicationsCount={vi.fn()} />);
    fillBaseFields(); // resume provided by default
    fireEvent.submit(getForm());
    await waitFor(() => expect(submitJobApplication).toHaveBeenCalled());

    const formData = vi.mocked(submitJobApplication).mock.calls[0][0];
    expect(formData.get('message')).toBeNull();
  });

  it('submits with coverLetterFile (upload mode)', async () => {
    vi.mocked(submitJobApplication).mockResolvedValue(true);
    render(<JobApplicationForm job={mockJob} locale="en" setApplicationsCount={vi.fn()} />);
    fillBaseFields();
    await userEvent.click(screen.getByText('applicationForm.buttons.upload'));

    const coverFile = new File(['cover'], 'cover.pdf', { type: 'application/pdf' });
    const coverInput = screen.getByLabelText(
      'applicationForm.labels.coverLetter',
    ) as HTMLInputElement;
    Object.defineProperty(coverInput, 'files', { value: new MockFileList(coverFile) });
    fireEvent.change(coverInput);

    fireEvent.submit(getForm());
    await waitFor(() => expect(submitJobApplication).toHaveBeenCalled());

    const formData = vi.mocked(submitJobApplication).mock.calls[0][0];
    expect(formData.get('coverLetterFile')).toBeInstanceOf(File);
  });

  it('shows success state', async () => {
    vi.mocked(submitJobApplication).mockResolvedValue(true);
    render(<JobApplicationForm job={mockJob} locale="en" setApplicationsCount={vi.fn()} />);
    fillBaseFields();
    fireEvent.submit(getForm());
    await waitFor(() =>
      expect(screen.getByText('applicationForm.successTitle')).toBeInTheDocument(),
    );
  });

  it('shows error on false response', async () => {
    vi.mocked(submitJobApplication).mockResolvedValue(false);
    render(<JobApplicationForm job={mockJob} locale="en" setApplicationsCount={vi.fn()} />);
    fillBaseFields();
    fireEvent.submit(getForm());
    await waitFor(() =>
      expect(screen.getByText('applicationForm.errors.submitFailed')).toBeInTheDocument(),
    );
  });

  it('shows error on exception', async () => {
    vi.mocked(submitJobApplication).mockRejectedValue(new Error('Network'));
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(<JobApplicationForm job={mockJob} locale="en" setApplicationsCount={vi.fn()} />);
    fillBaseFields();
    fireEvent.submit(getForm());
    await waitFor(() =>
      expect(screen.getByText('applicationForm.errors.submitFailed')).toBeInTheDocument(),
    );
    spy.mockRestore();
  });
});
