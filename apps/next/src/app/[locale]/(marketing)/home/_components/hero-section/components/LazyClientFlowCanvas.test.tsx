import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';

vi.mock('next/dynamic', () => ({
  default: (loader: any) => {
    loader().catch(() => {});
    return () => <div data-testid="canvas">Mock Canvas</div>;
  },
}));

vi.mock('./ClientFlowCanvas', () => ({
  ClientFlowCanvas: () => <div data-testid="real-canvas">Real Canvas</div>,
}));

import { LazyHeroCanvas } from './LazyClientFlowCanvas';

describe('LazyHeroCanvas', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    // @ts-expect-error - cleanup
    delete window.requestIdleCallback;
  });

  it('renders using requestIdleCallback if available', async () => {
    const requestIdleMock = vi.fn((cb) => {
      cb({ didTimeout: false, timeRemaining: () => 50 });
      return 1;
    });
    window.requestIdleCallback = requestIdleMock;
    window.cancelIdleCallback = vi.fn();

    render(<LazyHeroCanvas />);
    
    await act(async () => {
      await Promise.resolve();
    });

    expect(screen.getByTestId('canvas')).toBeInTheDocument();
    expect(requestIdleMock).toHaveBeenCalled();
  });

  it('cancels idle callback on unmount', async () => {
    const cancelIdleMock = vi.fn();
    window.requestIdleCallback = vi.fn(() => 42);
    window.cancelIdleCallback = cancelIdleMock;

    const { unmount } = render(<LazyHeroCanvas />);
    
    await act(async () => {
      await Promise.resolve();
    });

    unmount();
    expect(cancelIdleMock).toHaveBeenCalledWith(42);
  });

  it('falls back to setTimeout if requestIdleCallback is not available', async () => {
    // @ts-expect-error - deleting property for test
    delete window.requestIdleCallback;

    const { unmount } = render(<LazyHeroCanvas />);
    expect(screen.queryByTestId('canvas')).not.toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1200);
    });

    await act(async () => {
      await Promise.resolve();
    });

    expect(screen.getByTestId('canvas')).toBeInTheDocument();
    
    unmount();
  });
});
