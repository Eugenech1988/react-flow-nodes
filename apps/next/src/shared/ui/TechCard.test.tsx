import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { TechCard } from './TechCard';

describe('TechCard', () => {
  it('renders children', () => {
    render(<TechCard>Content</TechCard>);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('renders rivets by default', () => {
    const { container } = render(<TechCard>X</TechCard>);
    const rivets = container.querySelectorAll('span.rounded-full');
    expect(rivets.length).toBeGreaterThanOrEqual(4);
  });

  it('omits rivets when rivets={false}', () => {
    const { container } = render(<TechCard rivets={false}>X</TechCard>);
    const rivets = container.querySelectorAll('span.rounded-full');
    expect(rivets.length).toBe(0);
  });

  it('applies popular variant classes', () => {
    const { container } = render(<TechCard popular>X</TechCard>);
    expect(container.firstChild).toHaveClass('border-theme-accent/60');
    expect(container.firstChild).toHaveClass('md:-translate-y-4');
  });

  it.each(['careers', 'blog'] as const)('sets data-theme="%s"', (theme) => {
    const { container } = render(<TechCard theme={theme}>X</TechCard>);
    expect(container.firstChild).toHaveAttribute('data-theme', theme);
  });

  it('does not set data-theme when theme is omitted', () => {
    const { container } = render(<TechCard>X</TechCard>);
    expect(container.firstChild).not.toHaveAttribute('data-theme');
  });
});