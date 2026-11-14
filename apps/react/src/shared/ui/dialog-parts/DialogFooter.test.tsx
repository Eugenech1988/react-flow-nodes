import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { ElementType, MouseEvent } from 'react';
import { DialogFooter } from './DialogFooter';

interface IAppButtonProps {
  text?: string;
  type?: 'button' | 'submit' | 'reset';
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  isPending?: boolean;
  isDisabled?: boolean;
  variant?: string;
  icon?: ElementType | null;
}

vi.mock('@/shared/ui/AppButton', () => ({
  AppButton: ({ text, type, onClick, isPending, isDisabled, variant }: IAppButtonProps) => (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled || isPending}
      data-testid={`btn-${text}`}
      data-variant={variant}
      data-pending={isPending ? 'true' : 'false'}
    >
      {text}
    </button>
  ),
}));

describe('DialogFooter', () => {
  it('renders cancel and submit by default', () => {
    render(<DialogFooter onCancel={vi.fn()} submitText="Save" />);
    expect(screen.getByTestId('btn-Cancel')).toBeInTheDocument();
    expect(screen.getByTestId('btn-Save')).toBeInTheDocument();
  });

  it('calls onCancel', () => {
    const onCancel = vi.fn();
    render(<DialogFooter onCancel={onCancel} />);
    fireEvent.click(screen.getByTestId('btn-Cancel'));
    expect(onCancel).toHaveBeenCalled();
  });

  it('calls onSubmit when provided', () => {
    const onSubmit = vi.fn();
    render(<DialogFooter onCancel={vi.fn()} onSubmit={onSubmit} submitText="Save" />);
    fireEvent.click(screen.getByTestId('btn-Save'));
    expect(onSubmit).toHaveBeenCalled();
  });

  it('defaults to type="button" (no implicit submit)', () => {
    render(<DialogFooter onCancel={vi.fn()} submitText="Save" />);
    expect(screen.getByTestId('btn-Save')).toHaveAttribute('type', 'button');
  });

  it('uses type="button" when onSubmit is provided', () => {
    render(<DialogFooter onCancel={vi.fn()} onSubmit={vi.fn()} submitText="Save" />);
    expect(screen.getByTestId('btn-Save')).toHaveAttribute('type', 'button');
  });

  it('respects explicit type="submit"', () => {
    render(<DialogFooter type="submit" onCancel={vi.fn()} submitText="Save" />);
    expect(screen.getByTestId('btn-Save')).toHaveAttribute('type', 'submit');
  });

  it('cancel button is always type="button"', () => {
    render(<DialogFooter type="submit" onCancel={vi.fn()} submitText="Save" />);
    expect(screen.getByTestId('btn-Cancel')).toHaveAttribute('type', 'button');
  });

  it('hides submit when showSubmit=false', () => {
    render(<DialogFooter onCancel={vi.fn()} showSubmit={false} />);
    expect(screen.queryByTestId('btn-Save')).not.toBeInTheDocument();
  });

  it('hides cancel when showCancel=false', () => {
    render(<DialogFooter onCancel={vi.fn()} showCancel={false} />);
    expect(screen.queryByTestId('btn-Cancel')).not.toBeInTheDocument();
  });

  it('returns null when both hidden', () => {
    const { container } = render(
      <DialogFooter onCancel={vi.fn()} showSubmit={false} showCancel={false} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('maps variant="submit" → primary', () => {
    render(<DialogFooter onCancel={vi.fn()} variant="submit" />);
    expect(screen.getByTestId('btn-Save')).toHaveAttribute('data-variant', 'primary');
  });

  it('maps variant="danger" → danger', () => {
    render(<DialogFooter onCancel={vi.fn()} variant="danger" />);
    expect(screen.getByTestId('btn-Save')).toHaveAttribute('data-variant', 'danger');
  });

  it('passes through other variants', () => {
    render(<DialogFooter onCancel={vi.fn()} variant="secondary" />);
    expect(screen.getByTestId('btn-Save')).toHaveAttribute('data-variant', 'secondary');
  });

  it('disables buttons when pending', () => {
    render(<DialogFooter onCancel={vi.fn()} isPending />);
    expect(screen.getByTestId('btn-Cancel')).toBeDisabled();
    expect(screen.getByTestId('btn-Save')).toBeDisabled();
  });

  it('disables submit when isDisabled', () => {
    render(<DialogFooter onCancel={vi.fn()} isDisabled submitText="Save" />);
    expect(screen.getByTestId('btn-Save')).toBeDisabled();
    expect(screen.getByTestId('btn-Cancel')).not.toBeDisabled();
  });

  it('reverses button order with isReversedBtns', () => {
    const { container } = render(
      <DialogFooter onCancel={vi.fn()} isReversedBtns submitText="Save" />,
    );
    const buttons = container.querySelectorAll('button');
    expect(buttons[0]).toHaveTextContent('Save');
    expect(buttons[1]).toHaveTextContent('Cancel');
  });

  it('applies withBorder classes', () => {
    const { container } = render(<DialogFooter onCancel={vi.fn()} withBorder />);
    expect(container.firstChild).toHaveClass('border-t');
  });
});
