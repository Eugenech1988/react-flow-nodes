import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ThemeToggle } from './ThemeToggle';

const { mockSetTheme, mockUseTheme } = vi.hoisted(() => ({
  mockSetTheme: vi.fn(),
  mockUseTheme: vi.fn(),
}));

vi.mock('@/app/providers', () => ({
  useTheme: () => mockUseTheme(),
}));

vi.mock('@pipeline/ui', () => ({
  Button: ({
    children,
    onClick,
    className,
    title,
    ...props
  }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button onClick={onClick} className={className} title={title} {...props}>
      {children}
    </button>
  ),
}));

type TResolvedTheme = 'light' | 'dark';

const createUseThemeMock = (resolvedTheme: TResolvedTheme) => ({
  theme: resolvedTheme,
  resolvedTheme,
  setTheme: mockSetTheme,
});

describe('ThemeToggle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders toggle button', () => {
      mockUseTheme.mockReturnValue(createUseThemeMock('light'));

      render(<ThemeToggle />);

      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('renders accessible title', () => {
      mockUseTheme.mockReturnValue(createUseThemeMock('light'));

      render(<ThemeToggle />);

      expect(screen.getByTitle('Toggle theme')).toBeInTheDocument();
    });

    it('renders sr-only label for screen readers', () => {
      mockUseTheme.mockReturnValue(createUseThemeMock('light'));

      render(<ThemeToggle />);

      expect(screen.getByText('Toggle theme')).toHaveClass('sr-only');
    });
  });

  describe('icon visibility based on theme', () => {
    it('shows Sun icon and hides Moon icon when resolvedTheme is light', () => {
      mockUseTheme.mockReturnValue(createUseThemeMock('light'));
      const { container } = render(<ThemeToggle />);

      const sun = container.querySelector('.lucide-sun');
      const moon = container.querySelector('.lucide-moon');

      expect(sun).toHaveClass('scale-100');
      expect(sun).toHaveClass('rotate-0');
      expect(sun).toHaveClass('opacity-100');

      expect(moon).toHaveClass('scale-0');
      expect(moon).toHaveClass('-rotate-90');
      expect(moon).toHaveClass('opacity-0');
    });

    it('shows Moon icon and hides Sun icon when resolvedTheme is dark', () => {
      mockUseTheme.mockReturnValue(createUseThemeMock('dark'));
      const { container } = render(<ThemeToggle />);

      const sun = container.querySelector('.lucide-sun');
      const moon = container.querySelector('.lucide-moon');

      expect(sun).toHaveClass('scale-0');
      expect(sun).toHaveClass('rotate-90');
      expect(sun).toHaveClass('opacity-0');

      expect(moon).toHaveClass('scale-100');
      expect(moon).toHaveClass('rotate-0');
      expect(moon).toHaveClass('opacity-100');
    });
  });

  describe('toggle behavior', () => {
    it('calls setTheme("dark") when clicked in light mode', () => {
      mockUseTheme.mockReturnValue(createUseThemeMock('light'));

      render(<ThemeToggle />);
      fireEvent.click(screen.getByRole('button'));

      expect(mockSetTheme).toHaveBeenCalledTimes(1);
      expect(mockSetTheme).toHaveBeenCalledWith('dark');
    });

    it('calls setTheme("light") when clicked in dark mode', () => {
      mockUseTheme.mockReturnValue(createUseThemeMock('dark'));

      render(<ThemeToggle />);
      fireEvent.click(screen.getByRole('button'));

      expect(mockSetTheme).toHaveBeenCalledTimes(1);
      expect(mockSetTheme).toHaveBeenCalledWith('light');
    });

    it('never calls setTheme with "system"', () => {
      mockUseTheme.mockReturnValue(createUseThemeMock('light'));

      render(<ThemeToggle />);
      fireEvent.click(screen.getByRole('button'));

      expect(mockSetTheme).not.toHaveBeenCalledWith('system');
    });

    it('toggles correctly across multiple clicks', () => {
      mockUseTheme.mockReturnValue(createUseThemeMock('light'));
      const { rerender } = render(<ThemeToggle />);

      fireEvent.click(screen.getByRole('button'));
      expect(mockSetTheme).toHaveBeenLastCalledWith('dark');

      mockUseTheme.mockReturnValue(createUseThemeMock('dark'));
      rerender(<ThemeToggle />);

      fireEvent.click(screen.getByRole('button'));
      expect(mockSetTheme).toHaveBeenLastCalledWith('light');
      expect(mockSetTheme).toHaveBeenCalledTimes(2);
    });
  });
});
