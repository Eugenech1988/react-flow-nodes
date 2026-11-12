import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { AppButton } from './AppButton';

vi.mock('@pipeline/ui/button', () => ({
  Button: ({
    render: renderFn,
    children,
    ...props
  }: {
    render?: (p: Record<string, unknown>) => React.ReactNode;
    children?: React.ReactNode;
    [key: string]: unknown;
  }) => {
    if (typeof renderFn === 'function') return renderFn({ ...props, ref: undefined });
    const { type, disabled, ...rest } = props as Record<string, unknown>;
    return (
      <button
        type={type as 'button' | 'submit' | 'reset' | undefined}
        disabled={disabled as boolean | undefined}
        {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {children}
      </button>
    );
  },
}));

describe('AppButton', () => {
  describe('rendering: children / text', () => {
    it('renders children when text is absent', () => {
      render(<AppButton>Only children</AppButton>);
      expect(screen.getByRole('button', { name: 'Only children' })).toBeInTheDocument();
    });

    it('renders text when children are absent', () => {
      render(<AppButton text="Only text" />);
      expect(screen.getByRole('button', { name: 'Only text' })).toBeInTheDocument();
    });

    it('text wins over children', () => {
      render(<AppButton text="Text">Children</AppButton>);
      const button = screen.getByRole('button');
      expect(button).toHaveTextContent('Text');
      expect(button).not.toHaveTextContent('Children');
    });
  });

  describe('isPending branch (Loader2 + fallback chain)', () => {
    it('renders loader icon when isPending', () => {
      const { container } = render(
        <AppButton isPending pendingText="Loading">
          Submit
        </AppButton>,
      );
      expect(container.querySelector('.animate-spin')).toBeInTheDocument();
    });

    it('uses pendingText when provided', () => {
      render(
        <AppButton isPending pendingText="Pending">
          Child
        </AppButton>,
      );
      expect(screen.getByRole('button', { name: 'Pending' })).toBeInTheDocument();
    });

    it('falls back to text when pendingText is missing', () => {
      render(
        <AppButton isPending text="Fallback text">
          Child
        </AppButton>,
      );
      expect(screen.getByRole('button', { name: 'Fallback text' })).toBeInTheDocument();
    });

    it('falls back to children when pendingText and text are missing', () => {
      render(<AppButton isPending>Fallback child</AppButton>);
      expect(screen.getByRole('button', { name: 'Fallback child' })).toBeInTheDocument();
    });

    it('is disabled when isPending', () => {
      render(<AppButton isPending>X</AppButton>);
      expect(screen.getByRole('button')).toBeDisabled();
    });
  });

  describe('non-pending branch: icon', () => {
    it('renders icon when icon prop is passed', () => {
      const Icon = () => <svg data-testid="btn-icon" />;
      render(<AppButton icon={Icon}>Label</AppButton>);
      expect(screen.getByTestId('btn-icon')).toBeInTheDocument();
    });

    it('renders icon and children side by side', () => {
      const Icon = () => <svg data-testid="btn-icon" />;
      render(<AppButton icon={Icon}>Label</AppButton>);
      expect(screen.getByTestId('btn-icon')).toBeInTheDocument();
      expect(screen.getByRole('button')).toHaveTextContent('Label');
    });

    it('does not render icon when icon is null', () => {
      const { container } = render(<AppButton icon={null}>Label</AppButton>);
      expect(container.querySelector('svg')).not.toBeInTheDocument();
    });

    it('does not render icon when icon is undefined', () => {
      const { container } = render(<AppButton>Label</AppButton>);
      expect(container.querySelector('svg')).not.toBeInTheDocument();
    });
  });

  describe('isLink', () => {
    it('renders <a> when isLink + linkTo', () => {
      render(
        <AppButton isLink linkTo="/about">
          Go
        </AppButton>,
      );
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/about');
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('adds target and rel when newTab', () => {
      render(
        <AppButton isLink linkTo="https://x.com" newTab>
          Go
        </AppButton>,
      );
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('renders <button disabled> when isLink + disabled', () => {
      render(
        <AppButton isLink linkTo="/x" isDisabled>
          X
        </AppButton>,
      );
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('renders <button> when isLink but empty linkTo', () => {
      render(
        <AppButton isLink linkTo="">
          X
        </AppButton>,
      );
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  describe('sharedClasses: nav variant (variant !== "nav" branch)', () => {
    it('nav omits size min-h classes', () => {
      render(<AppButton variant="nav">Nav</AppButton>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('after:absolute');
      expect(button).not.toHaveClass('min-h-10');
    });

    it('primary applies size min-h-10', () => {
      render(<AppButton variant="primary">Btn</AppButton>);
      expect(screen.getByRole('button')).toHaveClass('min-h-10');
    });
  });

  describe('variant classes', () => {
    it.each([
      ['primary', 'bg-theme-accent-deep'],
      ['careers', 'border-theme-accent'],
      ['careers-outline', 'border-theme-line'],
      ['blog', 'bg-theme-accent/10'],
      ['blog-outline', 'text-theme-muted'],
      ['ghost', 'bg-transparent'],
      ['danger', 'bg-rose-600'],
      ['regular', 'bg-theme-surface'],
      ['secondary', 'bg-theme-surface/80'],
      ['teal', 'bg-theme-accent'],
    ] as const)('variant "%s" → %s', (variant, expectedClass) => {
      render(<AppButton variant={variant}>V</AppButton>);
      expect(screen.getByRole('button')).toHaveClass(expectedClass);
    });
  });

  describe('size classes', () => {
    it.each([
      ['xs', 'min-h-8'],
      ['sm', 'min-h-9'],
      ['md', 'min-h-10'],
      ['lg', 'min-h-12'],
    ] as const)('size "%s" → %s', (size, expected) => {
      render(<AppButton size={size}>V</AppButton>);
      expect(screen.getByRole('button')).toHaveClass(expected);
    });
  });

  describe('a11y', () => {
    it('applies ariaLabel', () => {
      render(<AppButton ariaLabel="Label">X</AppButton>);
      expect(screen.getByRole('button', { name: 'Label' })).toBeInTheDocument();
    });

    it('applies native aria-label', () => {
      render(<AppButton aria-label="Native">X</AppButton>);
      expect(screen.getByRole('button', { name: 'Native' })).toBeInTheDocument();
    });
  });

  describe('click', () => {
    it('calls onClick', async () => {
      const onClick = vi.fn();
      const user = userEvent.setup();
      render(<AppButton onClick={onClick}>Click</AppButton>);
      await user.click(screen.getByRole('button'));
      expect(onClick).toHaveBeenCalledOnce();
    });
  });
});

describe('blog variant: currentSize', () => {
  it.each(['blog', 'blog-outline'] as const)('%s + size="sm" → h-8 px-3 text-xs', (variant) => {
    render(
      <AppButton variant={variant} size="sm">
        V
      </AppButton>,
    );
    const button = screen.getByRole('button');
    expect(button).toHaveClass('h-8');
    expect(button).toHaveClass('px-3');
    expect(button).toHaveClass('text-xs');
  });

  it.each(['blog', 'blog-outline'] as const)('%s + size="lg" → h-11 px-6 text-sm', (variant) => {
    render(
      <AppButton variant={variant} size="lg">
        V
      </AppButton>,
    );
    const button = screen.getByRole('button');
    expect(button).toHaveClass('h-11');
    expect(button).toHaveClass('px-6');
    expect(button).toHaveClass('text-sm');
  });

  it.each(['blog', 'blog-outline'] as const)('%s + size="md" → h-9 px-4 text-sm', (variant) => {
    render(
      <AppButton variant={variant} size="md">
        V
      </AppButton>,
    );
    const button = screen.getByRole('button');
    expect(button).toHaveClass('h-9');
    expect(button).toHaveClass('px-4');
    expect(button).toHaveClass('text-sm');
  });

  it('blog + size="sm" applies small icon (w-3.5 h-3.5)', () => {
    const Icon = ({ className }: { className?: string }) => (
      <svg data-testid="icon" className={className} />
    );
    render(
      <AppButton variant="blog" size="sm" icon={Icon}>
        V
      </AppButton>,
    );
    const icon = screen.getByTestId('icon');
    expect(icon).toHaveClass('w-3.5');
    expect(icon).toHaveClass('h-3.5');
  });

  it('blog + size="lg" applies large icon (w-4 h-4)', () => {
    const Icon = ({ className }: { className?: string }) => (
      <svg data-testid="icon" className={className} />
    );
    render(
      <AppButton variant="blog" size="lg" icon={Icon}>
        V
      </AppButton>,
    );
    const icon = screen.getByTestId('icon');
    expect(icon).toHaveClass('w-4');
    expect(icon).toHaveClass('h-4');
  });
});
