import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

vi.mock('@/shared/lib/i18n/client', () => ({
  useT: () => ({ t: (key: string) => key }),
}));

vi.mock('@/shared/ui', () => ({
  SectionHeading: ({ title }: any) => <h2>{title}</h2>,
  Reveal: ({ children }: any) => <div>{children}</div>,
}));

vi.mock('@/widgets/careers-ui', () => ({
  StickyNoteCard: ({ title }: any) => <div>{title}</div>,
}));

import { CareersProcess } from './CareersProcess';
import { PROCESS_STEPS } from '../constants';

describe('CareersProcess', () => {
  it('renders heading and all steps', () => {
    render(<CareersProcess />);
    expect(screen.getByText('process.heading.title')).toBeInTheDocument();
    PROCESS_STEPS.forEach((step) => {
      expect(screen.getByText(`process.steps.${step.id}.title`)).toBeInTheDocument();
    });
  });
});
