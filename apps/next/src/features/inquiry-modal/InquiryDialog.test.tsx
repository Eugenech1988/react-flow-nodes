import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import type { ReactNode } from 'react';

vi.mock('@/shared/lib/i18n/client', () => ({
  useT: () => ({ t: (key: string) => key }),
}));

vi.mock('@/entities/inquiry/InquiryForm', () => ({
  InquiryForm: ({ type, submitVariant }: { type: string; submitVariant: string }) => (
    <div data-testid="inquiry-form" data-type={type} data-variant={submitVariant} />
  ),
}));

vi.mock('@pipeline/ui/dialog', () => ({
  Dialog: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  DialogContent: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div data-testid="dialog-content" {...props}>
      {children}
    </div>
  ),
  DialogTitle: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 {...props}>{children}</h2>
  ),
  DialogDescription: ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p {...props}>{children}</p>
  ),
  DialogClose: ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button {...props}>{children}</button>
  ),
}));

vi.mock('@/shared/ui/AppModal', () => ({
  AppModal: ({
    children,
    title,
    description,
  }: {
    children: ReactNode;
    title: string;
    description: string;
  }) => (
    <div data-testid="app-modal" data-title={title} data-description={description}>
      {children}
    </div>
  ),
}));

import { InquiryDialog } from './InquiryDialog';

describe('InquiryDialog', () => {
  const baseProps = { isOpen: true, onOpenChange: vi.fn() };

  beforeEach(() => vi.clearAllMocks());

  describe('careers theme', () => {
    it('renders DialogContent with data-theme="careers"', () => {
      render(<InquiryDialog {...baseProps} type="contact" theme="careers" />);
      expect(screen.getByTestId('dialog-content')).toHaveAttribute('data-theme', 'careers');
    });

    it('renders InquiryForm with submitVariant="careers"', () => {
      render(<InquiryDialog {...baseProps} type="contact" theme="careers" />);
      const form = screen.getByTestId('inquiry-form');
      expect(form).toHaveAttribute('data-variant', 'careers');
      expect(form).toHaveAttribute('data-type', 'contact');
    });

    it('does not render AppModal', () => {
      render(<InquiryDialog {...baseProps} type="contact" theme="careers" />);
      expect(screen.queryByTestId('app-modal')).not.toBeInTheDocument();
    });

    it('renders sr-only title and description', () => {
      render(<InquiryDialog {...baseProps} type="contact" theme="careers" />);
      expect(screen.getByRole('heading', { name: 'contact.title' })).toHaveClass('sr-only');
      expect(screen.getByText('contact.description')).toHaveClass('sr-only');
    });

    it('renders close button', () => {
      render(<InquiryDialog {...baseProps} type="contact" theme="careers" />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it.each(['demo', 'review', 'contact', 'glitch'] as const)('renders type "%s"', (type) => {
      render(<InquiryDialog {...baseProps} type={type} theme="careers" />);
      expect(screen.getByTestId('inquiry-form')).toHaveAttribute('data-type', type);
    });

    it('does not render InquiryForm when closed', () => {
      render(
        <InquiryDialog isOpen={false} onOpenChange={vi.fn()} type="contact" theme="careers" />,
      );
      expect(screen.queryByTestId('inquiry-form')).not.toBeInTheDocument();
    });
  });

  describe('default theme', () => {
    it('renders AppModal', () => {
      render(<InquiryDialog {...baseProps} type="demo" theme="default" />);
      expect(screen.getByTestId('app-modal')).toBeInTheDocument();
    });

    it('passes title and description to AppModal', () => {
      render(<InquiryDialog {...baseProps} type="demo" theme="default" />);
      const modal = screen.getByTestId('app-modal');
      expect(modal).toHaveAttribute('data-title', 'demo.title');
      expect(modal).toHaveAttribute('data-description', 'demo.description');
    });

    it('renders InquiryForm with submitVariant="primary"', () => {
      render(<InquiryDialog {...baseProps} type="demo" theme="default" />);
      expect(screen.getByTestId('inquiry-form')).toHaveAttribute('data-variant', 'primary');
    });

    it('does not render careers DialogContent', () => {
      render(<InquiryDialog {...baseProps} type="demo" theme="default" />);
      expect(screen.queryByTestId('dialog-content')).not.toBeInTheDocument();
    });

    it('does not render InquiryForm when closed', () => {
      render(<InquiryDialog isOpen={false} onOpenChange={vi.fn()} type="demo" theme="default" />);
      expect(screen.queryByTestId('inquiry-form')).not.toBeInTheDocument();
    });
  });
});
