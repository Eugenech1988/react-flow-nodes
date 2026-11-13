import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { BackgroundGrid } from './BackgroundGrid';

describe('BackgroundGrid', () => {
  it('renders with dots variant by default', () => {
    const { container } = render(<BackgroundGrid />);
    expect(container.firstChild).toHaveClass(
      'bg-[radial-gradient(circle_at_center,color-mix(in_oklab,var(--theme-accent)_8%,transparent)_1px,transparent_1.5px)]',
    );
    expect(container.firstChild).toHaveClass('bg-size-[16px_16px]');
  });

  it('renders with lines variant', () => {
    const { container } = render(<BackgroundGrid variant="lines" />);
    expect(container.firstChild).toHaveClass(
      'bg-[linear-gradient(to_right,color-mix(in_oklab,var(--theme-accent)_3%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklab,var(--theme-accent)_3%,transparent)_1px,transparent_1px)]',
    );
    expect(container.firstChild).toHaveClass('bg-size-[4rem_4rem]');
  });

  it('applies custom className', () => {
    const { container } = render(<BackgroundGrid className="my-grid" />);
    expect(container.firstChild).toHaveClass('my-grid');
  });

  it('is hidden from assistive tech', () => {
    const { container } = render(<BackgroundGrid />);
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true');
  });
});