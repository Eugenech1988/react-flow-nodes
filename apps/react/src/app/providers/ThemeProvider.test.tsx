import { render, screen, act, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ThemeProvider, useTheme } from './ThemeProvider';

const mockMatchMedia = (matches: boolean) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
};

const TestComponent = () => {
  const { theme, resolvedTheme, setTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <span data-testid="resolved">{resolvedTheme}</span>
      <button onClick={() => setTheme('dark')}>Set Dark</button>
      <button onClick={() => setTheme('system')}>Set System</button>
    </div>
  );
};

describe('ThemeProvider', () => {
  const originalConsoleError = console.error;

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = '';
    mockMatchMedia(false);
    console.error = vi.fn();
  });

  afterEach(() => {
    console.error = originalConsoleError;
    vi.restoreAllMocks();
  });

  it('uses default system theme', () => {
    render(
      <ThemeProvider defaultTheme="system">
        <TestComponent />
      </ThemeProvider>,
    );
    expect(screen.getByTestId('theme').textContent).toBe('system');
    expect(screen.getByTestId('resolved').textContent).toBe('light');
  });

  it('reads stored theme from localStorage', () => {
    localStorage.setItem('theme', 'dark');
    render(
      <ThemeProvider defaultTheme="light">
        <TestComponent />
      </ThemeProvider>,
    );
    expect(screen.getByTestId('theme').textContent).toBe('dark');
  });

  it('falls back to defaultTheme when localStorage.getItem throws', () => {
    vi.spyOn(localStorage, 'getItem').mockImplementationOnce(() => {
      throw new Error('localStorage disabled');
    });

    render(
      <ThemeProvider defaultTheme="dark">
        <TestComponent />
      </ThemeProvider>,
    );
    expect(screen.getByTestId('theme').textContent).toBe('dark');
  });

  it('updates theme and localStorage on setTheme (success path)', () => {
    render(
      <ThemeProvider defaultTheme="light">
        <TestComponent />
      </ThemeProvider>,
    );

    fireEvent.click(screen.getByText('Set Dark'));

    expect(screen.getByTestId('theme').textContent).toBe('dark');
    expect(screen.getByTestId('resolved').textContent).toBe('dark');
    expect(localStorage.getItem('theme')).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('falls back gracefully when localStorage.setItem throws (catch path)', () => {
    render(
      <ThemeProvider defaultTheme="light">
        <TestComponent />
      </ThemeProvider>,
    );

    // Spy on instance method directly — this is what the component calls
    vi.spyOn(localStorage, 'setItem').mockImplementationOnce(() => {
      throw new Error('QuotaExceededError');
    });

    // Should not throw, state should still update
    expect(() => {
      fireEvent.click(screen.getByText('Set Dark'));
    }).not.toThrow();

    expect(screen.getByTestId('theme').textContent).toBe('dark');
    expect(screen.getByTestId('resolved').textContent).toBe('dark');
  });

  it('syncs theme across tabs via storage event', () => {
    render(
      <ThemeProvider defaultTheme="light">
        <TestComponent />
      </ThemeProvider>,
    );

    act(() => {
      window.dispatchEvent(new StorageEvent('storage', { key: 'theme', newValue: 'dark' }));
    });

    expect(screen.getByTestId('theme').textContent).toBe('dark');
  });

  it('ignores storage events for other keys', () => {
    render(
      <ThemeProvider defaultTheme="light">
        <TestComponent />
      </ThemeProvider>,
    );

    act(() => {
      window.dispatchEvent(new StorageEvent('storage', { key: 'other-key', newValue: 'dark' }));
    });

    expect(screen.getByTestId('theme').textContent).toBe('light');
  });

  it('ignores invalid stored theme values', () => {
    localStorage.setItem('theme', 'invalid-value');
    render(
      <ThemeProvider defaultTheme="light">
        <TestComponent />
      </ThemeProvider>,
    );
    expect(screen.getByTestId('theme').textContent).toBe('light');
  });

  it('ignores storage events with invalid newValue', () => {
    render(
      <ThemeProvider defaultTheme="light">
        <TestComponent />
      </ThemeProvider>,
    );

    act(() => {
      window.dispatchEvent(new StorageEvent('storage', { key: 'theme', newValue: 'garbage' }));
    });

    expect(screen.getByTestId('theme').textContent).toBe('light');
  });

  it('reacts to system preference changes when theme is system (matches=true)', () => {
    let mediaQueryListener: ((e: MediaQueryListEvent) => void) = () => {};

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        addEventListener: (_type: string, cb: (e: MediaQueryListEvent) => void) => {
          mediaQueryListener = cb;
        },
        removeEventListener: vi.fn(),
      })),
    });

    render(
      <ThemeProvider defaultTheme="system">
        <TestComponent />
      </ThemeProvider>,
    );

    expect(screen.getByTestId('resolved').textContent).toBe('light');

    act(() => {
      mediaQueryListener({ matches: true } as MediaQueryListEvent);
    });

    expect(screen.getByTestId('resolved').textContent).toBe('dark');
  });

  it('reacts to system preference changes when theme is system (matches=false)', () => {
    let mediaQueryListener: ((e: MediaQueryListEvent) => void) = () => {};

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: true,
        media: query,
        addEventListener: (_type: string, cb: (e: MediaQueryListEvent) => void) => {
          mediaQueryListener = cb;
        },
        removeEventListener: vi.fn(),
      })),
    });

    render(
      <ThemeProvider defaultTheme="system">
        <TestComponent />
      </ThemeProvider>,
    );

    expect(screen.getByTestId('resolved').textContent).toBe('dark');

    act(() => {
      mediaQueryListener({ matches: false } as MediaQueryListEvent);
    });

    expect(screen.getByTestId('resolved').textContent).toBe('light');
  });

  it('throws when useTheme is called outside ThemeProvider', () => {
    expect(() => render(<TestComponent />)).toThrow('useTheme must be used within ThemeProvider');
  });
});
