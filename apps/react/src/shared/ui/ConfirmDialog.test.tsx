import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { Trash2 } from 'lucide-react';
import { ConfirmDialog } from './ConfirmDialog';

describe('ConfirmDialog', () => {
  it('renders nothing when closed', () => {
    const { container } = render(
      <ConfirmDialog
        isOpen={false}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        title="Title"
        message="Body"
      />,
    );
    expect(container.querySelector('[role="dialog"]')).toBeNull();
  });

  it('renders title and message when open', () => {
    render(
      <ConfirmDialog
        isOpen
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        title="Title X"
        message="Body Y"
      />,
    );
    expect(screen.getByText('Title X')).toBeInTheDocument();
    expect(screen.getByText('Body Y')).toBeInTheDocument();
  });

  it('calls onConfirm when submit clicked', () => {
    const onConfirm = vi.fn();
    render(
      <ConfirmDialog
        isOpen
        onClose={vi.fn()}
        onConfirm={onConfirm}
        title="t"
        message="m"
        submitText="Yes"
      />,
    );
    fireEvent.click(screen.getByText('Yes'));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when cancel clicked', () => {
    const onClose = vi.fn();
    render(
      <ConfirmDialog
        isOpen
        onClose={onClose}
        onConfirm={vi.fn()}
        title="t"
        message="m"
        cancelText="No"
      />,
    );
    fireEvent.click(screen.getByText('No'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('swaps submit text to pendingText when isPending', () => {
    render(
      <ConfirmDialog
        isOpen
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        title="t"
        message="m"
        isPending
        submitText="Go"
        pendingText="Wait..."
      />,
    );
    expect(screen.queryByText('Go')).not.toBeInTheDocument();
    expect(screen.getByText('Wait...')).toBeInTheDocument();
  });

  it('accepts custom icon', () => {
    const { container } = render(
      <ConfirmDialog
        isOpen
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        title="t"
        message="m"
        icon={Trash2}
      />,
    );
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});