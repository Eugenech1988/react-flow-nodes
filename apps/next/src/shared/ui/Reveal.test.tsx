import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';

const mockUseInView = vi.fn();

vi.mock('@/shared/hooks', () => ({
  useInView: () => mockUseInView(),
}));

import { Reveal } from './Reveal';

describe('Reveal', () => {
  beforeEach(() => {
    mockUseInView.mockReturnValue({ ref: { current: null }, inView: false });
  });

  it('renders children', () => {
    render(<Reveal>Hello</Reveal>);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('applies opacity-0 before intersection', () => {
    const { container } = render(<Reveal>Content</Reveal>);
    expect(container.firstChild).toHaveClass('opacity-0');
    expect(container.firstChild).toHaveStyle({ animationDelay: '0ms' });
  });

  it('applies animation class after intersection', () => {
    mockUseInView.mockReturnValue({ ref: { current: null }, inView: true });
    const { container } = render(<Reveal animation="fade-up">Content</Reveal>);
    expect(container.firstChild).toHaveClass('animate-in');
    expect(container.firstChild).toHaveClass('slide-in-from-bottom-8');
    expect(container.firstChild).not.toHaveClass('opacity-0');
  });

  it('applies delay as animationDelay', () => {
    mockUseInView.mockReturnValue({ ref: { current: null }, inView: true });
    const { container } = render(<Reveal delay={200}>Content</Reveal>);
    expect(container.firstChild).toHaveStyle({ animationDelay: '200ms' });
  });

  it.each([
    ['fade-up', 'slide-in-from-bottom-8'],
    ['fade-left', 'slide-in-from-left-8'],
    ['fade-right', 'slide-in-from-right-8'],
    ['zoom', 'zoom-in-95'],
  ] as const)('applies "%s" animation class', (animation, expectedClass) => {
    mockUseInView.mockReturnValue({ ref: { current: null }, inView: true });
    const { container } = render(<Reveal animation={animation}>Content</Reveal>);
    expect(container.firstChild).toHaveClass(expectedClass);
  });

  it('applies custom className', () => {
    const { container } = render(<Reveal className="my-reveal">Content</Reveal>);
    expect(container.firstChild).toHaveClass('my-reveal');
  });
});
