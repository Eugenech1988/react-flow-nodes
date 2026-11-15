import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { LocalAlert } from './LocalAlert';
import { MockAlertProps } from '@/test-utils';

vi.mock('@pipeline/ui', () => ({
  Alert: ({ children, variant, className }: MockAlertProps) => (
    <div data-testid="alert" data-variant={variant} className={className}>
      {children}
    </div>
  ),
  AlertTitle: ({ children, className }: MockAlertProps) => (
    <h3 className={className}>{children}</h3>
  ),
  AlertDescription: ({ children, className }: MockAlertProps) => (
    <p className={className}>{children}</p>
  ),
}));

vi.mock('lucide-react', () => ({
  AlertCircle: () => <span data-testid="icon-error" />,
  CheckCircle2: () => <span data-testid="icon-success" />,
}));

describe('LocalAlert', () => {
  it('renders nothing when no flags set', () => {
    const { container } = render(
      <LocalAlert hasError={false} hasSuccess={false} alertMessage="" />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders error state', () => {
    render(<LocalAlert hasError hasSuccess={false} alertMessage="Something failed" />);
    expect(screen.getByTestId('alert')).toHaveAttribute('data-variant', 'destructive');
    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText('Something failed')).toBeInTheDocument();
    expect(screen.getByTestId('icon-error')).toBeInTheDocument();
  });

  it('renders success state', () => {
    render(<LocalAlert hasError={false} hasSuccess alertMessage="All good" />);
    expect(screen.getByTestId('alert')).toHaveAttribute('data-variant', 'default');
    expect(screen.getByText('Success')).toBeInTheDocument();
    expect(screen.getByText('All good')).toBeInTheDocument();
    expect(screen.getByTestId('icon-success')).toBeInTheDocument();
  });

  it('prefers error when both flags set', () => {
    render(<LocalAlert hasError hasSuccess alertMessage="msg" />);
    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.queryByText('Success')).not.toBeInTheDocument();
  });
});
