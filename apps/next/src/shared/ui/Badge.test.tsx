import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { Badge } from './Badge';

describe('Badge', () => {
  describe('hex variant', () => {
    it('renders children', () => {
      render(<Badge variant="hex">ENGINEERING</Badge>);
      expect(screen.getByText('ENGINEERING')).toBeInTheDocument();
    });

    it.each(['default', 'careers', 'blog'] as const)(
      'renders with theme "%s" without crashing',
      (theme) => {
        render(<Badge variant="hex" theme={theme}>X</Badge>);
        expect(screen.getByText('X')).toBeInTheDocument();
      },
    );

    it('applies hex clip-path class', () => {
      const { container } = render(<Badge variant="hex">X</Badge>);
      expect(container.firstChild).toHaveClass('[clip-path:polygon(6px_0,calc(100%-6px)_0,100%_50%,calc(100%-6px)_100%,6px_100%,0_50%)]');
    });
  });

  describe('pill variant', () => {
    it('renders children', () => {
      render(<Badge variant="pill">STATUS</Badge>);
      expect(screen.getByText('STATUS')).toBeInTheDocument();
    });

    it('uses font-typewriter for careers theme', () => {
      render(<Badge variant="pill" theme="careers">X</Badge>);
      expect(screen.getByText('X')).toHaveClass('font-typewriter');
    });

    it('uses font-typewriter + accent-hover for blog theme', () => {
      render(<Badge variant="pill" theme="blog">X</Badge>);
      const label = screen.getByText('X');
      expect(label).toHaveClass('font-typewriter');
      expect(label).toHaveClass('text-theme-accent-hover');
    });

    it('renders exactly 4 rivet dots', () => {
      const { container } = render(<Badge variant="pill">X</Badge>);
      const rivets = container.querySelectorAll('span.rounded-full.w-1');
      expect(rivets.length).toBe(4);
    });
  });

  it('applies custom className', () => {
    render(<Badge variant="hex" className="custom">X</Badge>);
    const outer = screen.getByText('X').closest('div');
    expect(outer?.parentElement).toHaveClass('custom');
  });
});