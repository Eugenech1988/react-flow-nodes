import { forwardRef, createElement, type ReactNode } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { InquiryForm } from './InquiryForm';
import { sendInquiry } from '@/shared/api/mail';

vi.mock('@/shared/lib/i18n/client', () => ({
  useT: () => ({
    t: (key: string, opts?: { defaultValue?: string }) => opts?.defaultValue ?? key,
  }),
}));

vi.mock('@/shared/api/mail', () => ({
  sendInquiry: vi.fn(),
}));

vi.mock('@pipeline/contracts', async () => {
  const { z } = await import('zod');
  return {
    sendInquiryInputSchema: z.object({
      type: z.enum(['demo', 'review', 'contact', 'glitch']),
    }),
  };
});

vi.mock('@/shared/ui', async () => {
  return {
    AppInput: forwardRef<HTMLInputElement, Record<string, unknown>>((props, ref) => {
      const { error: _error, theme: _theme, ...rest } = props;
      return createElement('input', { ...rest, ref });
    }),

    AppTextarea: forwardRef<HTMLTextAreaElement, Record<string, unknown>>((props, ref) => {
      const { error: _error, theme: _theme, ...rest } = props;
      return createElement('textarea', { ...rest, ref });
    }),

    AppLabel: (props: Record<string, unknown>) => {
      const { theme: _theme, ...rest } = props;
      return createElement('label', rest);
    },

    AppButton: (props: Record<string, unknown>) => {
      const {
        variant: _variant,
        size: _size,
        icon: _icon,
        isPending,
        pendingText,
        isDisabled,
        children,
        ...rest
      } = props;

      const content = (isPending ? pendingText : children) as ReactNode;

      return createElement(
        'button',
        { ...rest, disabled: Boolean(isDisabled || isPending) },
        content,
      );
    },
  };
});

describe('InquiryForm', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    vi.clearAllMocks();
    user = userEvent.setup();
  });

  const getForm = () => document.querySelector('form') as HTMLFormElement;

  const fillValidForm = async () => {
    await user.type(screen.getByLabelText('form.name'), 'Jo');
    await user.type(screen.getByLabelText('form.email'), 'a@b.co');
    await user.type(screen.getByLabelText('form.company'), 'Acme');
    await user.type(screen.getByLabelText('form.position'), 'Dev');
    await user.type(screen.getByLabelText('form.message'), '1234567890');
  };

  describe('rendering', () => {
    it('renders all fields and submit button', () => {
      render(<InquiryForm />);

      expect(screen.getByLabelText('form.name')).toBeInTheDocument();
      expect(screen.getByLabelText('form.email')).toBeInTheDocument();
      expect(screen.getByLabelText('form.company')).toBeInTheDocument();
      expect(screen.getByLabelText('form.position')).toBeInTheDocument();
      expect(screen.getByLabelText('form.message')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'form.modes.demo.submit' })).toBeInTheDocument();
    });

    it('uses demo type by default', () => {
      render(<InquiryForm />);
      expect(screen.getByPlaceholderText('form.placeholderName')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('form.modes.demo.placeholderMessage')).toBeInTheDocument();
    });

    it('uses contact type when prop is set', () => {
      render(<InquiryForm type="contact" />);
      expect(
        screen.getByPlaceholderText('form.modes.contact.placeholderMessage'),
      ).toBeInTheDocument();
    });
  });

  describe('validation', () => {
    it('shows all errors on empty submit and does not call API', async () => {
      render(<InquiryForm />);

      fireEvent.submit(getForm());

      await waitFor(() => {
        expect(screen.getByText('form.errors.name')).toBeInTheDocument();
        expect(screen.getByText('form.errors.email')).toBeInTheDocument();
        expect(screen.getByText('form.errors.company')).toBeInTheDocument();
        expect(screen.getByText('form.errors.position')).toBeInTheDocument();
        expect(screen.getByText('form.errors.message')).toBeInTheDocument();
      });

      expect(sendInquiry).not.toHaveBeenCalled();
    });

    it('shows email error for invalid email', async () => {
      render(<InquiryForm />);

      await user.type(screen.getByLabelText('form.name'), 'Jo');
      await user.type(screen.getByLabelText('form.email'), 'not-an-email');
      await user.type(screen.getByLabelText('form.company'), 'Acme');
      await user.type(screen.getByLabelText('form.position'), 'Dev');
      await user.type(screen.getByLabelText('form.message'), '1234567890');

      fireEvent.submit(getForm());

      await waitFor(() => {
        expect(screen.getByText('form.errors.email')).toBeInTheDocument();
      });
      expect(sendInquiry).not.toHaveBeenCalled();
    });

    it('shows name error when name is too short', async () => {
      render(<InquiryForm />);

      await user.type(screen.getByLabelText('form.name'), 'J');
      await user.type(screen.getByLabelText('form.email'), 'a@b.co');
      await user.type(screen.getByLabelText('form.company'), 'Acme');
      await user.type(screen.getByLabelText('form.position'), 'Dev');
      await user.type(screen.getByLabelText('form.message'), '1234567890');

      fireEvent.submit(getForm());

      await waitFor(() => {
        expect(screen.getByText('form.errors.name')).toBeInTheDocument();
      });
    });
  });

  describe('submission', () => {
    it('calls sendInquiry with correct payload on valid submit', async () => {
      vi.mocked(sendInquiry).mockResolvedValue(true);
      render(<InquiryForm />);

      await fillValidForm();
      fireEvent.submit(getForm());

      await waitFor(() => {
        expect(sendInquiry).toHaveBeenCalledWith({
          name: 'Jo',
          email: 'a@b.co',
          company: 'Acme',
          position: 'Dev',
          message: '1234567890',
          type: 'demo',
        });
      });
    });

    it('shows success state and unmounts form on success', async () => {
      vi.mocked(sendInquiry).mockResolvedValue(true);
      render(<InquiryForm />);

      await fillValidForm();
      fireEvent.submit(getForm());

      await waitFor(() => {
        expect(screen.getByText('form.modes.demo.success')).toBeInTheDocument();
      });

      expect(screen.queryByLabelText('form.name')).not.toBeInTheDocument();
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('shows error banner and keeps form on failure', async () => {
      vi.mocked(sendInquiry).mockResolvedValue(false);
      render(<InquiryForm />);

      await fillValidForm();
      fireEvent.submit(getForm());

      await waitFor(() => {
        expect(screen.getByText('Failed to send request. Please try again.')).toBeInTheDocument();
      });

      expect(screen.getByLabelText('form.name')).toBeInTheDocument();
    });

    it('shows pending state during submission', async () => {
      vi.mocked(sendInquiry).mockImplementation(() => new Promise<boolean>(() => {}));
      render(<InquiryForm />);

      await fillValidForm();
      fireEvent.submit(getForm());

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'form.modes.demo.submitting' })).toBeDisabled();
      });
    });
  });

  describe('theming', () => {
    it('renders with careers variant without crashing', () => {
      render(<InquiryForm submitVariant="careers" />);
      expect(screen.getByLabelText('form.name')).toBeInTheDocument();
    });
  });
});
