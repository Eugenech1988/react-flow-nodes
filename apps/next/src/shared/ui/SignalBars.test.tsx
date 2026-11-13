import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { SignalBars } from './SignalBars';

describe('SignalBars', () => {
  it('renders 5 bars', () => {
    const { container } = render(<SignalBars />);
    expect(container.querySelectorAll('span')).toHaveLength(5);
  });

  it('applies custom className', () => {
    const { container } = render(<SignalBars className="custom" />);
    expect(container.firstChild).toHaveClass('custom');
  });

  it('applies animation delay per bar', () => {
    const { container } = render(<SignalBars />);
    const bars = container.querySelectorAll('span');
    expect(bars[0]).toHaveStyle({ animationDelay: '0ms' });
    expect(bars[4]).toHaveStyle({ animationDelay: '600ms' });
  });
});