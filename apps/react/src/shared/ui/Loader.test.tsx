import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { GlobalLoader } from './Loader';

vi.mock('@/assets/logo.svg', () => ({ default: 'logo.svg' }));

describe('GlobalLoader', () => {
  it('renders logo', () => {
    render(<GlobalLoader />);
    expect(screen.getByAltText('Workspace Logo')).toBeInTheDocument();
  });

  it('uses min-h-screen by default', () => {
    const { container } = render(<GlobalLoader />);
    expect(container.firstChild).toHaveClass('min-h-screen');
  });

  it('uses h-full w-full when fullScreen=false', () => {
    const { container } = render(<GlobalLoader fullScreen={false} />);
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveClass('h-full', 'w-full');
    expect(el).not.toHaveClass('min-h-screen');
  });

  it('applies custom className', () => {
    const { container } = render(<GlobalLoader className="custom" />);
    expect(container.firstChild).toHaveClass('custom');
  });

  it('has pulse animation on logo wrapper', () => {
    const { container } = render(<GlobalLoader />);
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
  });
});
