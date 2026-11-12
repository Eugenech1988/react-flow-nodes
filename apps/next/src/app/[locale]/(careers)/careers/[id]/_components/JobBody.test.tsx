import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import type { TPublicJob } from '@/shared/api';

vi.mock('@/shared/lib/i18n/client', () => ({
  useT: () => ({ t: (key: string) => key }),
}));

vi.mock('@/shared/ui', () => ({
  AppButton: ({ children, onClick }: any) => <button onClick={onClick}>{children}</button>,
}));

import { JobBody } from './JobBody';

const mockJob: TPublicJob = {
  id: '1',
  slug: 'job',
  title: 'Title',
  description: 'Description',
  responsibilities: ['Resp 1'],
  requirements: ['Req 1'],
  department: 'ENGINEERING',
  level: 'SENIOR',
  type: 'FULL_TIME',
  location: 'Remote',
  icon: null,
  metaTitle: null,
  metaDescription: null,
  views: 0,
  applications: 0,
};

describe('JobBody', () => {
  const scrollToForm = vi.fn();

  it('renders description, responsibilities, requirements', () => {
    render(<JobBody job={mockJob} scrollToForm={scrollToForm} />);
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Resp 1')).toBeInTheDocument();
    expect(screen.getByText('Req 1')).toBeInTheDocument();
  });

  it('calls scrollToForm on button click', () => {
    render(<JobBody job={mockJob} scrollToForm={scrollToForm} />);
    fireEvent.click(screen.getByText('details.initiateApplication'));
    expect(scrollToForm).toHaveBeenCalled();
  });
});
