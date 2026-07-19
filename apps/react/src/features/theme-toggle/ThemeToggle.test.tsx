import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ThemeToggle } from './ThemeToggle';

const { useThemeMock } = vi.hoisted(() => ({
  useThemeMock: vi.fn(),
}));

vi.mock('@/app/providers', () => ({
  useTheme: useThemeMock,
}));

vi.mock('@pipeline/ui', () => ({
  Button: ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button {...props}>{children}</button>
  ),
}));

describe('ThemeToggle', () => {
  const setTheme = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  it('renders toggle button', () => {
    useThemeMock.mockReturnValue({
      theme: 'light',
      setTheme,
    });

    render(<ThemeToggle />);

    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByTitle('Toggle theme')).toBeInTheDocument();
    expect(screen.getByText('Toggle theme')).toHaveClass('sr-only');
  });

  it('switches from light to dark', () => {
    useThemeMock.mockReturnValue({
      theme: 'light',
      setTheme,
    });

    render(<ThemeToggle />);

    fireEvent.click(screen.getByRole('button'));

    expect(setTheme).toHaveBeenCalledWith('dark');
  });

  it('switches from dark to light', () => {
    useThemeMock.mockReturnValue({
      theme: 'dark',
      setTheme,
    });

    render(<ThemeToggle />);

    fireEvent.click(screen.getByRole('button'));

    expect(setTheme).toHaveBeenCalledWith('light');
  });

  it('uses system theme when prefers light', () => {
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: false,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    useThemeMock.mockReturnValue({
      theme: 'system',
      setTheme,
    });

    render(<ThemeToggle />);

    fireEvent.click(screen.getByRole('button'));

    expect(setTheme).toHaveBeenCalledWith('dark');
  });

  it('uses system theme when prefers dark', () => {
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: true,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    useThemeMock.mockReturnValue({
      theme: 'system',
      setTheme,
    });

    render(<ThemeToggle />);

    fireEvent.click(screen.getByRole('button'));

    expect(setTheme).toHaveBeenCalledWith('light');
  });
});