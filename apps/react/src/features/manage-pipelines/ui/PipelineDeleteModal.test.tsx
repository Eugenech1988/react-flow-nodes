import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { ReactNode } from 'react';
import { PipelineDeleteModal } from './PipelineDeleteModal';

interface IConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPending?: boolean;
  title: string;
  message: ReactNode;
}

vi.mock('@/shared/ui/ConfirmDeleteModal', () => ({
  ConfirmDeleteModal: ({
    isOpen,
    onClose,
    onConfirm,
    isPending,
    title,
    message,
  }: IConfirmDeleteModalProps) =>
    isOpen ? (
      <div data-testid="confirm-modal">
        <h2>{title}</h2>
        <div data-testid="confirm-message">{message}</div>
        <button onClick={onConfirm} disabled={isPending}>
          Confirm
        </button>
        <button onClick={onClose}>Cancel</button>
      </div>
    ) : null,
}));

describe('PipelineDeleteModal', () => {
  it('renders nothing when closed', () => {
    const { container } = render(
      <PipelineDeleteModal
        isOpen={false}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        pipelineName="x"
      />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders title and name', () => {
    render(
      <PipelineDeleteModal
        isOpen
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        pipelineName="My Pipeline"
      />,
    );
    expect(screen.getByText('Delete Pipeline')).toBeInTheDocument();
    expect(screen.getByTestId('confirm-message')).toHaveTextContent('My Pipeline');
  });

  it('triggers onConfirm', () => {
    const onConfirm = vi.fn();
    render(
      <PipelineDeleteModal isOpen onClose={vi.fn()} onConfirm={onConfirm} pipelineName="x" />,
    );
    fireEvent.click(screen.getByText('Confirm'));
    expect(onConfirm).toHaveBeenCalled();
  });

  it('triggers onClose', () => {
    const onClose = vi.fn();
    render(
      <PipelineDeleteModal isOpen onClose={onClose} onConfirm={vi.fn()} pipelineName="x" />,
    );
    fireEvent.click(screen.getByText('Cancel'));
    expect(onClose).toHaveBeenCalled();
  });

  it('disables confirm when pending', () => {
    render(
      <PipelineDeleteModal
        isOpen
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        pipelineName="x"
        isPending
      />,
    );
    expect(screen.getByText('Confirm')).toBeDisabled();
  });
});
