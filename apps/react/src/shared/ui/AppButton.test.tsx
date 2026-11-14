import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import type { ElementType, MouseEvent, ReactElement, ReactNode } from 'react';
import { AppButton } from './AppButton';

interface IMockButtonProps {
  children?: ReactNode;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  render?: (props: { onClick?: (e: MouseEvent<HTMLButtonElement>) => void }) => ReactElement;
}

vi.mock('@pipeline/ui', () => ({
  Button: ({ children, onClick, className, type, disabled, render }: IMockButtonProps) => {
    if (render) {
      return render({ onClick });
    }
    return (
      <button onClick={onClick} className={className} type={type} disabled={disabled}>
        {children}
      </button>
    );
  },
}));

vi.mock('lucide-react', () => ({
  Loader2: ({ className }: { className?: string }) => (
    <span data-testid="loader" className={className} />
  ),
}));

const renderWithRouter = (ui: ReactElement) => render(<MemoryRouter>{ui}</MemoryRouter>);

const Icon: ElementType = () => <span data-testid="icon" />;

describe('AppButton', () => {
  describe('basic rendering', () => {
    it('renders text', () => {
      renderWithRouter(<AppButton text="Click" />);
      expect(screen.getByText('Click')).toBeInTheDocument();
    });

    it('renders icon when provided', () => {
      renderWithRouter(<AppButton text="Btn" icon={Icon} />);
      expect(screen.getByTestId('icon')).toBeInTheDocument();
    });

    it('applies default variant primary', () => {
      renderWithRouter(<AppButton text="Btn" />);
      expect(screen.getByRole('button')).toHaveClass('text-white');
    });

    it('applies default size md', () => {
      renderWithRouter(<AppButton text="Btn" />);
      expect(screen.getByRole('button')).toHaveClass('min-h-10');
    });

    it('applies custom className', () => {
      renderWithRouter(<AppButton text="Btn" className="custom" />);
      expect(screen.getByRole('button')).toHaveClass('custom');
    });
  });

  describe('click and submit', () => {
    it('calls onClick', () => {
      const onClick = vi.fn();
      renderWithRouter(<AppButton text="Btn" onClick={onClick} />);
      fireEvent.click(screen.getByRole('button'));
      expect(onClick).toHaveBeenCalled();
    });

    it('defaults type to button', () => {
      renderWithRouter(<AppButton text="Btn" />);
      expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
    });

    it('respects submit type', () => {
      renderWithRouter(<AppButton text="Btn" type="submit" />);
      expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
    });
  });

  describe('pending state', () => {
    it('shows Loader2 when pending', () => {
      renderWithRouter(<AppButton text="Save" isPending />);
      expect(screen.getByTestId('loader')).toBeInTheDocument();
    });

    it('shows pendingText instead of text', () => {
      renderWithRouter(<AppButton text="Save" pendingText="Saving..." isPending />);
      expect(screen.getByText('Saving...')).toBeInTheDocument();
      expect(screen.queryByText('Save')).not.toBeInTheDocument();
    });

    it('falls back to text when no pendingText', () => {
      renderWithRouter(<AppButton text="Save" isPending />);
      expect(screen.getByText('Save')).toBeInTheDocument();
    });

    it('disables when pending', () => {
      renderWithRouter(<AppButton text="Btn" isPending />);
      expect(screen.getByRole('button')).toBeDisabled();
    });
  });

  describe('disabled state', () => {
    it('disables when isDisabled', () => {
      renderWithRouter(<AppButton text="Btn" isDisabled />);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('does not fire onClick when disabled', () => {
      const onClick = vi.fn();
      renderWithRouter(<AppButton text="Btn" isDisabled onClick={onClick} />);
      fireEvent.click(screen.getByRole('button'));
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe('isLink mode', () => {
    it('renders internal link', () => {
      renderWithRouter(<AppButton text="Go" isLink linkTo="/dashboard" />);
      expect(screen.getByRole('link')).toHaveAttribute('href', '/dashboard');
    });

    it('renders external link with target blank', () => {
      renderWithRouter(<AppButton text="Go" isLink linkTo="https://example.com" />);
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', 'https://example.com');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('renders button when isLink but disabled', () => {
      renderWithRouter(<AppButton text="Btn" isLink linkTo="/x" isDisabled />);
      expect(screen.queryByRole('link')).not.toBeInTheDocument();
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('renders button when isLink but no linkTo', () => {
      renderWithRouter(<AppButton text="Btn" isLink />);
      expect(screen.queryByRole('link')).not.toBeInTheDocument();
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  describe('variants', () => {
    it('renders secondary variant', () => {
      renderWithRouter(<AppButton text="Btn" variant="secondary" />);
      expect(screen.getByRole('button')).toHaveClass('border-zinc-200');
    });

    it('renders danger variant', () => {
      renderWithRouter(<AppButton text="Btn" variant="danger" />);
      expect(screen.getByRole('button')).toHaveClass('from-rose-600');
    });

    it('renders ghost variant', () => {
      renderWithRouter(<AppButton text="Btn" variant="ghost" />);
      expect(screen.getByRole('button')).toHaveClass('bg-transparent');
    });
  });

  describe('sizes', () => {
    it('renders xs size', () => {
      renderWithRouter(<AppButton text="Btn" size="xs" />);
      expect(screen.getByRole('button')).toHaveClass('min-h-8');
    });

    it('renders sm size', () => {
      renderWithRouter(<AppButton text="Btn" size="sm" />);
      expect(screen.getByRole('button')).toHaveClass('min-h-9');
    });
  });
});
