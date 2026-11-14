import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ReactNode } from 'react';

interface IDialogProps {
  children: ReactNode;
  open: boolean;
}

interface IChildrenProps {
  children: ReactNode;
}

interface IDialogHeaderProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  onClose: () => void;
}

interface IAppButtonProps {
  text?: string;
  onClick?: () => void;
  isDisabled?: boolean;
  isLink?: boolean;
  linkTo?: string;
  icon?: unknown;
  variant?: string;
  size?: string;
}

const mockUseUser = vi.hoisted(() => ({
  current: { user: { currentPipeline: { id: 'p1' } } } as {
    user: { currentPipeline: { id: string } } | null;
  },
}));
const mockLocation = vi.hoisted(() => ({ pathname: '/' }));
const mockWriteText = vi.fn<(text: string) => Promise<void>>();

vi.mock('@/shared/hooks', () => ({
  useUser: () => mockUseUser.current,
}));

vi.mock('react-router-dom', () => ({
  useLocation: () => ({ pathname: mockLocation.pathname }),
}));

vi.mock('@pipeline/ui', () => ({
  Dialog: ({ children, open }: IDialogProps) =>
    open ? <div data-testid="dialog">{children}</div> : null,
  DialogContent: ({ children }: IChildrenProps) => <div>{children}</div>,
}));

vi.mock('@/shared/ui', () => ({
  AppButton: ({ text, onClick, isDisabled }: IAppButtonProps) => (
    <button onClick={onClick} disabled={isDisabled}>
      {text}
    </button>
  ),
  DialogBody: ({ children }: IChildrenProps) => <div>{children}</div>,
  DialogHeader: ({ title, onClose }: IDialogHeaderProps) => (
    <div>
      <h2>{title}</h2>
      <button onClick={onClose}>close-header</button>
    </div>
  ),
}));

import { ShareDialog } from './ShareDialog';

describe('ShareDialog', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocation.pathname = '/';
    mockUseUser.current = { user: { currentPipeline: { id: 'p1' } } };
    mockWriteText.mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: mockWriteText },
    });
    window.history.replaceState({}, '', '/?pipeline=p1');
  });

  it('renders share button enabled on home', () => {
    render(<ShareDialog />);
    expect(screen.getByText('Share').closest('button')).not.toBeDisabled();
  });

  it('disables share button outside home', () => {
    mockLocation.pathname = '/pipelines';
    render(<ShareDialog />);
    expect(screen.getByText('Share').closest('button')).toBeDisabled();
  });

  it('opens dialog on click', () => {
    render(<ShareDialog />);
    fireEvent.click(screen.getByText('Share'));
    expect(screen.getByTestId('dialog')).toBeInTheDocument();
    expect(screen.getByText('Share workflow')).toBeInTheDocument();
  });

  it('shows share URL with pipeline param', () => {
    render(<ShareDialog />);
    fireEvent.click(screen.getByText('Share'));
    const input = screen.getByLabelText('Workflow share link') as HTMLInputElement;
    expect(input.value).toContain('pipeline=p1');
  });

  it('copies URL and shows confirmation', async () => {
    render(<ShareDialog />);
    fireEvent.click(screen.getByText('Share'));
    fireEvent.click(screen.getByText('Copy link'));

    await waitFor(() => {
      expect(mockWriteText).toHaveBeenCalledTimes(1);
      expect(screen.getByText('Copied')).toBeInTheDocument();
    });
  });

  it('handles clipboard error silently', async () => {
    mockWriteText.mockRejectedValueOnce(new Error('denied'));
    render(<ShareDialog />);
    fireEvent.click(screen.getByText('Share'));
    fireEvent.click(screen.getByText('Copy link'));

    await waitFor(() => {
      expect(screen.getByText('Copy link')).toBeInTheDocument();
    });
    expect(screen.queryByText('Copied')).not.toBeInTheDocument();
  });

  it('closes dialog via header close', () => {
    render(<ShareDialog />);
    fireEvent.click(screen.getByText('Share'));
    fireEvent.click(screen.getByText('close-header'));
    expect(screen.queryByTestId('dialog')).not.toBeInTheDocument();
  });

  it('renders without pipeline id when user has no current pipeline', () => {
    mockUseUser.current = { user: null };
    render(<ShareDialog />);
    fireEvent.click(screen.getByText('Share'));
    const input = screen.getByLabelText('Workflow share link') as HTMLInputElement;
    expect(input.value).not.toContain('pipeline=');
  });
});
