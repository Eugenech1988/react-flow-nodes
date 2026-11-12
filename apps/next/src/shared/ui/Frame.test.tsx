import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { Frame } from './Frame';

vi.mock('lucide-react', async () => {
  const actual = await vi.importActual<typeof import('lucide-react')>('lucide-react');
  return { ...actual };
});

describe('Frame', () => {
  const baseProps = { headerTitle: 'SYS.FRAME' };

  it('renders headerTitle', () => {
    render(<Frame {...baseProps}>body</Frame>);
    expect(screen.getByText('SYS.FRAME')).toBeInTheDocument();
  });

  it('renders children', () => {
    render(<Frame {...baseProps}>Body content</Frame>);
    expect(screen.getByText('Body content')).toBeInTheDocument();
  });

  it('renders footer when provided', () => {
    render(
      <Frame {...baseProps} footer={<span>Footer content</span>}>
        body
      </Frame>,
    );
    expect(screen.getByText('Footer content')).toBeInTheDocument();
  });

  it('does not render footer when omitted', () => {
    const { container } = render(<Frame {...baseProps}>body</Frame>);
    expect(container.querySelector('.border-t')).not.toBeInTheDocument();
  });

  it('renders toolbar when provided', () => {
    render(
      <Frame {...baseProps} toolbar={<span>TOOLBAR</span>}>
        body
      </Frame>,
    );
    expect(screen.getByText('TOOLBAR')).toBeInTheDocument();
  });

  it.each(['default', 'careers', 'blog'] as const)('sets data-theme="%s"', (theme) => {
    const { container } = render(
      <Frame {...baseProps} theme={theme}>
        body
      </Frame>,
    );
    expect(container.firstChild).toHaveAttribute('data-theme', theme);
  });

  it('renders hazard stripes when hasHazardStripes', () => {
    const { container } = render(
      <Frame {...baseProps} hasHazardStripes>
        body
      </Frame>,
    );
    expect(container.querySelector('[class*="repeating-linear-gradient"]')).toBeInTheDocument();
  });

  it('does not render hazard stripes when hasHazardStripes is false', () => {
    const { container } = render(<Frame {...baseProps}>body</Frame>);
    expect(container.querySelector('[class*="repeating-linear-gradient"]')).not.toBeInTheDocument();
  });

  it('uses terminal variant headerBg style', () => {
    const { container } = render(
      <Frame {...baseProps} variant="terminal">
        body
      </Frame>,
    );
    expect(container.firstChild).toHaveClass('border-theme-line-strong');
  });
});
