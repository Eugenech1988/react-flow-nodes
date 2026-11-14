import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TwoFactorModal } from './TwoFactorModal';

vi.mock('@pipeline/ui', async () => {
  const React = await import('react');

  const Dialog = ({
    children,
    open,
  }: {
    children: React.ReactNode;
    open: boolean;
    onOpenChange?: (open: boolean) => void;
  }) => (open ? <div data-testid="dialog">{children}</div> : null);

  const DialogContent = ({
    children,
  }: {
    children: React.ReactNode;
    showCloseButton?: boolean;
    className?: string;
  }) => <div>{children}</div>;

  const DialogHeader = ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => <header className={className}>{children}</header>;

  const DialogTitle = ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => <h2 className={className}>{children}</h2>;

  const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
    (props, ref) => <input ref={ref} {...props} />,
  );

  const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
    ({ children, ...props }, ref) => (
      <button ref={ref} {...props}>
        {children}
      </button>
    ),
  );

  return { Dialog, DialogContent, DialogHeader, DialogTitle, Input, Button };
});

interface IRenderProps {
  isOpen?: boolean;
  mode?: 'enable' | 'disable';
  qrCodeImage?: string | null;
  modalError?: string | null;
  isPending?: boolean;
  onConfirm?: (code: string) => Promise<string[] | void>;
  onClose?: () => void;
}

const DEFAULT_QR = 'data:image/png;base64,qr';

const renderModal = (props: IRenderProps = {}) => {
  const onConfirm = props.onConfirm ?? vi.fn().mockResolvedValue(undefined);
  const onClose = props.onClose ?? vi.fn();

  const qrCodeImage = props.qrCodeImage === undefined ? DEFAULT_QR : props.qrCodeImage;

  render(
    <TwoFactorModal
      isOpen={props.isOpen ?? true}
      mode={props.mode ?? 'enable'}
      qrCodeImage={qrCodeImage}
      modalError={props.modalError ?? null}
      isPending={props.isPending ?? false}
      onConfirm={onConfirm}
      onClose={onClose}
    />,
  );

  return { onConfirm, onClose };
};

const typeCode = async (placeholder: string, value: string): Promise<void> => {
  await act(async () => {
    fireEvent.change(screen.getByPlaceholderText(placeholder), {
      target: { value },
    });
  });
};

describe('TwoFactorModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls onConfirm exactly once when the submit button is clicked', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn().mockResolvedValue(undefined);
    renderModal({ onConfirm });

    await typeCode('123456', '123456');
    await user.click(screen.getByRole('button', { name: /^enable$/i }));

    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onConfirm).toHaveBeenCalledWith('123456');
  });

  it('calls onConfirm exactly once when the form is submitted directly', async () => {
    const onConfirm = vi.fn().mockResolvedValue(undefined);
    renderModal({ onConfirm });

    await typeCode('123456', '123456');

    const form = document.querySelector('form');
    if (!(form instanceof HTMLFormElement)) {
      throw new Error('form not rendered');
    }

    await act(async () => {
      fireEvent.submit(form);
    });

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('does not have an onClick handler on the submit button', () => {
    renderModal({ onConfirm: vi.fn() });

    const submitBtn = screen.getByRole('button', { name: /^enable$/i });

    expect(submitBtn.getAttribute('type')).toBe('submit');
  });

  it('displays recovery codes after successful enable', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn().mockResolvedValue(['CODE-1', 'CODE-2', 'CODE-3']);
    renderModal({ onConfirm });

    await typeCode('123456', '654321');
    await user.click(screen.getByRole('button', { name: /^enable$/i }));

    expect(screen.getByText('Save your recovery codes')).toBeInTheDocument();
    expect(screen.getByText('CODE-1')).toBeInTheDocument();
    expect(screen.getByText('CODE-2')).toBeInTheDocument();
    expect(screen.getByText('CODE-3')).toBeInTheDocument();
  });

  it('disables the submit button when QR is missing in enable mode', async () => {
    renderModal({ mode: 'enable', qrCodeImage: null });

    await typeCode('123456', '123456');

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /^enable$/i })).toBeDisabled();
    });
  });

  it('disables the submit button when the code is invalid', async () => {
    renderModal({ mode: 'enable' });

    await typeCode('123456', '12');

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /^enable$/i })).toBeDisabled();
    });
  });

  it('calls onClose in disable mode after successful confirm', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn().mockResolvedValue(undefined);
    const onClose = vi.fn();
    renderModal({ mode: 'disable', onConfirm, onClose });

    await typeCode('123456 or recovery code', '123456');
    await user.click(screen.getByRole('button', { name: /^disable$/i }));

    expect(onConfirm).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(onClose).toHaveBeenCalled();
    });
  });

  it('does not call onClose in enable mode when codes are returned', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn().mockResolvedValue(['CODE-1']);
    const onClose = vi.fn();
    renderModal({ mode: 'enable', onConfirm, onClose });

    await typeCode('123456', '123456');
    await user.click(screen.getByRole('button', { name: /^enable$/i }));

    expect(screen.getByText('Save your recovery codes')).toBeInTheDocument();
    expect(onClose).not.toHaveBeenCalled();
  });

  it('renders modalError when provided', () => {
    renderModal({ modalError: 'Invalid code' });

    expect(screen.getByText('Invalid code')).toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    renderModal({ isOpen: false });

    expect(screen.queryByText('Enable 2FA')).not.toBeInTheDocument();
  });
});
