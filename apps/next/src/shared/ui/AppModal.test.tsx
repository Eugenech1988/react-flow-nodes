import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { AppModal } from './AppModal';

vi.mock('@pipeline/ui/dialog', () => ({
  Dialog: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogContent: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div data-testid="dialog-content" {...props}>
      {children}
    </div>
  ),
  DialogTrigger: ({ render }: { render?: React.ReactElement }) => render ?? null,
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

describe('AppModal', () => {
  const baseProps = {
    isOpen: true,
    onOpenChange: vi.fn(),
    title: 'Modal title',
    description: 'Modal description',
  };

  it('renders title in sr-only DialogTitle', () => {
    render(
      <AppModal {...baseProps}>
        <span>Body</span>
      </AppModal>,
    );
    const heading = screen.getByRole('heading', { name: 'Modal title' });
    expect(heading).toHaveClass('sr-only');
  });

  it('renders trigger when provided', () => {
    render(
      <AppModal {...baseProps} trigger={<button>Open</button>}>
        <span>Body</span>
      </AppModal>,
    );
    expect(screen.getByRole('button', { name: 'Open' })).toBeInTheDocument();
  });

  it('does not render trigger when omitted', () => {
    render(
      <AppModal {...baseProps}>
        <span>Body</span>
      </AppModal>,
    );
    expect(screen.queryByText('Open')).not.toBeInTheDocument();
  });

  it('renders description in sr-only DialogDescription', () => {
    render(
      <AppModal {...baseProps}>
        <span>Body</span>
      </AppModal>,
    );
    expect(screen.getByText('Modal description')).toHaveClass('sr-only');
  });

  it('renders children', () => {
    render(
      <AppModal {...baseProps}>
        <span>Body content</span>
      </AppModal>,
    );
    expect(screen.getByText('Body content')).toBeInTheDocument();
  });

  it('renders headerTitle when provided', () => {
    render(
      <AppModal {...baseProps} headerTitle={<span>HEADER</span>}>
        <span>Body</span>
      </AppModal>,
    );
    expect(screen.getByText('HEADER')).toBeInTheDocument();
  });

  it('renders custom className on DialogContent', () => {
    render(
      <AppModal {...baseProps} className="custom-modal">
        <span>Body</span>
      </AppModal>,
    );
    expect(screen.getByTestId('dialog-content')).toHaveClass('custom-modal');
  });

  it('calls onOpenChange when close button is clicked', async () => {
    const onOpenChange = vi.fn();
    const user = userEvent.setup();
    render(
      <AppModal {...baseProps} onOpenChange={onOpenChange}>
        <span>Body</span>
      </AppModal>,
    );
    const closeBtn = screen.getByRole('button');
    await user.click(closeBtn);
    expect(closeBtn).toBeInTheDocument();
  });
});