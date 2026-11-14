import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ThemeProvider, useTheme } from './ThemeProvider';

const mockMatchMedia = (matches: boolean) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  });
};

const TestComponent = () => {
  const { theme } = useTheme();
  return <span data-testid="theme">{theme}</span>;
};

describe('ThemeProvider — extra branches', () => {
  beforeEach(() => {
    localStorage.clear();
    mockMatchMedia(false);
  });

  it('ignores storage events with invalid newValue', () => {
    render(
      <ThemeProvider defaultTheme="light">
        <TestComponent />
      </ThemeProvider>,
    );

    act(() => {
      window.dispatchEvent(
        new StorageEvent('storage', { key: 'theme', newValue: 'garbage' }),
      );
    });

    expect(screen.getByTestId('theme').textContent).toBe('light');
  });

  it('ignores storage events with null newValue', () => {
    render(
      <ThemeProvider defaultTheme="light">
        <TestComponent />
      </ThemeProvider>,
    );

    act(() => {
      window.dispatchEvent(
        new StorageEvent('storage', { key: 'theme', newValue: null }),
      );
    });

    expect(screen.getByTestId('theme').textContent).toBe('light');
  });

  it('starts with dark when system prefers dark', () => {
    mockMatchMedia(true);

    render(
      <ThemeProvider defaultTheme="system">
        <TestComponent />
      </ThemeProvider>,
    );

    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });
});
