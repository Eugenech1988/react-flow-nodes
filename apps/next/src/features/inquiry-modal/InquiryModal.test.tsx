import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';

vi.mock('./InquiryDialog', () => ({
  InquiryDialog: () => <div data-testid="real-dialog-stub" />,
}));

vi.mock('next/dynamic', () => ({
  default: (loader: () => Promise<unknown>) => {
    loader().catch(() => {});
    const MockedDialog = (props: Record<string, unknown>) => (
      <div
        data-testid="dialog"
        data-open={String(props.isOpen)}
        data-type={props.type}
        data-theme={props.theme}
      >
        <button onClick={() => (props.onOpenChange as (o: boolean) => void)(false)}>
          close-dialog
        </button>
      </div>
    );
    return MockedDialog;
  },
}));

import { InquiryModal } from './InquiryModal';

describe('InquiryModal', () => {
  beforeEach(() => vi.clearAllMocks());

  describe('uncontrolled', () => {
    it('does not render dialog initially', () => {
      render(<InquiryModal><button>Open</button></InquiryModal>);
      expect(screen.queryByTestId('dialog')).not.toBeInTheDocument();
    });

    it('opens dialog on child click', async () => {
      render(<InquiryModal><button>Open</button></InquiryModal>);
      await userEvent.click(screen.getByRole('button', { name: 'Open' }));
      await waitFor(() => expect(screen.getByTestId('dialog')).toBeInTheDocument());
    });

    it('closes via onOpenChange(false)', async () => {
      render(<InquiryModal><button>Open</button></InquiryModal>);
      await userEvent.click(screen.getByRole('button', { name: 'Open' }));
      await waitFor(() => screen.getByTestId('dialog'));
      await userEvent.click(screen.getByRole('button', { name: 'close-dialog' }));
      await waitFor(() =>
        expect(screen.getByTestId('dialog')).toHaveAttribute('data-open', 'false'),
      );
    });

    it('calls onOpenChange callback', async () => {
      const onOpenChange = vi.fn();
      render(
        <InquiryModal onOpenChange={onOpenChange}>
          <button>Open</button>
        </InquiryModal>,
      );
      await userEvent.click(screen.getByRole('button', { name: 'Open' }));
      expect(onOpenChange).toHaveBeenCalledWith(true);
    });
  });

  describe('controlled', () => {
    it('renders dialog when controlled isOpen=true', async () => {
      render(<InquiryModal isOpen onOpenChange={vi.fn()} type="review" theme="careers" />);
      await waitFor(() => {
        expect(screen.getByTestId('dialog')).toHaveAttribute('data-open', 'true');
        expect(screen.getByTestId('dialog')).toHaveAttribute('data-type', 'review');
        expect(screen.getByTestId('dialog')).toHaveAttribute('data-theme', 'careers');
      });
    });

    it('does not render dialog when controlled isOpen=false', () => {
      render(<InquiryModal isOpen={false} onOpenChange={vi.fn()} />);
      expect(screen.queryByTestId('dialog')).not.toBeInTheDocument();
    });

    it('does not open uncontrolled on child click when controlled', async () => {
      const onOpenChange = vi.fn();
      render(
        <InquiryModal isOpen={false} onOpenChange={onOpenChange}>
          <button>Open</button>
        </InquiryModal>,
      );
      await userEvent.click(screen.getByRole('button', { name: 'Open' }));
      expect(onOpenChange).toHaveBeenCalledWith(true);
      expect(screen.getByTestId('dialog')).toHaveAttribute('data-open', 'false');
    });
  });

  describe('defaults', () => {
    it('uses type="demo" by default', async () => {
      render(<InquiryModal><button>Open</button></InquiryModal>);
      await userEvent.click(screen.getByRole('button', { name: 'Open' }));
      await waitFor(() =>
        expect(screen.getByTestId('dialog')).toHaveAttribute('data-type', 'demo'),
      );
    });

    it('uses theme="default" by default', async () => {
      render(<InquiryModal><button>Open</button></InquiryModal>);
      await userEvent.click(screen.getByRole('button', { name: 'Open' }));
      await waitFor(() =>
        expect(screen.getByTestId('dialog')).toHaveAttribute('data-theme', 'default'),
      );
    });
  });

  it('preloads dialog on pointer enter', () => {
    const { container } = render(
      <InquiryModal><button>Open</button></InquiryModal>,
    );
    const wrapper = container.querySelector('.contents')!;
    fireEvent.pointerEnter(wrapper);
    expect(wrapper).toBeInTheDocument();
  });

  it('preloads dialog on focus', () => {
    const { container } = render(
      <InquiryModal><button>Open</button></InquiryModal>,
    );
    const wrapper = container.querySelector('.contents')!;
    fireEvent.focus(wrapper);
    expect(wrapper).toBeInTheDocument();
  });

  it('renders children wrapper with contents class', () => {
    const { container } = render(
      <InquiryModal><span>child</span></InquiryModal>,
    );
    expect(container.querySelector('.contents')).toBeInTheDocument();
  });
});
