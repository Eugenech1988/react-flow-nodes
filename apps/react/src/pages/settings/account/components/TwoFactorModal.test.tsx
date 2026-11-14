import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { InputHTMLAttributes, ButtonHTMLAttributes, ReactNode, Ref } from 'react';
import { TwoFactorModal } from './TwoFactorModal';

interface IDialogProps {
  children: ReactNode;
  open: boolean;
}

interface IHeaderProps {
  children?: ReactNode;
  className?: string;
}

vi.mock('@pipeline/ui', async () => {
  const React = await import('react');

  const Dialog = ({ children, open }: IDialogProps) =>
    open ? <div data-testid="dialog">{children}</div> : null;
  const DialogContent = ({ children }: { children: ReactNode }) => <div>{children}</div>;
  const DialogHeader = ({ children, className }: IHeaderProps) => (
    <header className={className}>{children}</header>
  );
  const DialogTitle = ({ children, className }: IHeaderProps) => (
    <h2 className={className}>{children}</h2>
  );
  const Input = React.forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
    (props, ref: Ref<HTMLInputElement>) => <input ref={ref} {...props} />,
  );
  const Button = React.forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement>>(
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
  onRetryGenerate?: () => void;
}

const DEFAULT_QR = 'data:image/png;base64,qr';
const mockWriteText = vi.fn<(text: string) => Promise<void>>();

const renderModal = (props: IRenderProps = {}) => {
  const onConfirm = props.onConfirm ?? vi.fn().mockResolvedValue(undefined);
  const onClose = props.onClose ?? vi.fn();
  const onRetryGenerate = props.onRetryGenerate ?? vi.fn();
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
      onRetryGenerate={onRetryGenerate}
    />,
  );

  return { onConfirm, onClose, onRetryGenerate };
};

const typeCode = async (placeholder: string, value: string): Promise<void> => {
  await act(async () => {
    fireEvent.change(screen.getByPlaceholderText(placeholder), {
      target: { value },
    });
  });
};

const stubClipboard = (): void => {
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: { writeText: mockWriteText },
  });
};

describe('TwoFactorModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockWriteText.mockResolvedValue(undefined);
    stubClipboard();
  });

  it('calls onConfirm once when submit clicked', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn().mockResolvedValue(undefined);
    renderModal({ onConfirm });

    await typeCode('123456', '123456');
    await user.click(screen.getByRole('button', { name: /^enable$/i }));

    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onConfirm).toHaveBeenCalledWith('123456');
  });

  it('calls onConfirm once on direct form submit', async () => {
    const onConfirm = vi.fn().mockResolvedValue(undefined);
    renderModal({ onConfirm });

    await typeCode('123456', '123456');

    const form = document.querySelector('form');
    if (!(form instanceof HTMLFormElement)) throw new Error('form missing');
    await act(async () => {
      fireEvent.submit(form);
    });

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('submit button has type=submit', () => {
    renderModal({ onConfirm: vi.fn() });
    expect(screen.getByRole('button', { name: /^enable$/i }).getAttribute('type')).toBe('submit');
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

  it('copies recovery codes to clipboard', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn().mockResolvedValue(['CODE-1', 'CODE-2']);
    renderModal({ onConfirm });

    await typeCode('123456', '123456');
    await user.click(screen.getByRole('button', { name: /^enable$/i }));

    stubClipboard();

    fireEvent.click(screen.getByText('Copy codes').closest('button')!);

    expect(mockWriteText).toHaveBeenCalledWith('CODE-1\nCODE-2');
    await waitFor(() => {
      expect(screen.getByText('Copied to clipboard')).toBeInTheDocument();
    });
  });

  it('closes modal via Done button after recovery codes', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn().mockResolvedValue(['CODE-1']);
    const onClose = vi.fn();
    renderModal({ onConfirm, onClose });

    await typeCode('123456', '123456');
    await user.click(screen.getByRole('button', { name: /^enable$/i }));
    await user.click(screen.getByRole('button', { name: /^done$/i }));

    expect(onClose).toHaveBeenCalled();
  });

  it('disables submit when QR missing in enable mode', async () => {
    renderModal({ mode: 'enable', qrCodeImage: null });
    await typeCode('123456', '123456');
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /^enable$/i })).toBeDisabled();
    });
  });

  it('disables submit when code invalid', async () => {
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

  it('does not call onClose in enable mode when codes returned', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn().mockResolvedValue(['CODE-1']);
    const onClose = vi.fn();
    renderModal({ mode: 'enable', onConfirm, onClose });

    await typeCode('123456', '123456');
    await user.click(screen.getByRole('button', { name: /^enable$/i }));

    expect(screen.getByText('Save your recovery codes')).toBeInTheDocument();
    expect(onClose).not.toHaveBeenCalled();
  });

  it('renders modalError', () => {
    renderModal({ modalError: 'Invalid code' });
    expect(screen.getByText('Invalid code')).toBeInTheDocument();
  });

  it('renders retry button when QR generation failed', () => {
    const onRetryGenerate = vi.fn();
    renderModal({
      mode: 'enable',
      qrCodeImage: null,
      modalError: 'Generation failed',
      onRetryGenerate,
    });

    const retryBtn = screen.getByText('Retry').closest('button')!;
    fireEvent.click(retryBtn);
    expect(onRetryGenerate).toHaveBeenCalledTimes(1);
  });

  it('does not render when isOpen=false', () => {
    renderModal({ isOpen: false });
    expect(screen.queryByText('Enable 2FA')).not.toBeInTheDocument();
  });
});
