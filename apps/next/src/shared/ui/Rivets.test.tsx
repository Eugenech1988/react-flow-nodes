import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { Rivets } from './Rivets';

describe('Rivets', () => {
  it('renders 4 rivets', () => {
    const { container } = render(<Rivets />);
    expect(container.querySelectorAll('span')).toHaveLength(4);
  });

  it('uses compact positions (top-2) when compact', () => {
    const { container } = render(<Rivets compact />);
    const spans = container.querySelectorAll('span');
    expect(spans[0]).toHaveClass('top-2');
    expect(spans[0]).toHaveClass('left-2');
  });

  it('uses default positions (top-3) when not compact', () => {
    const { container } = render(<Rivets />);
    const spans = container.querySelectorAll('span');
    expect(spans[0]).toHaveClass('top-3');
    expect(spans[0]).toHaveClass('left-3');
  });

  it('applies custom className to rivets', () => {
    const { container } = render(<Rivets className="bg-theme-accent" />);
    const spans = container.querySelectorAll('span');
    expect(spans[0]).toHaveClass('bg-theme-accent');
  });
});
