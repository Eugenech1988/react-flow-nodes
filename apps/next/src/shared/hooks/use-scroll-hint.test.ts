import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useScrollHint } from './use-scroll-hint';

const observeMock = vi.fn();
const disconnectMock = vi.fn();

class MockResizeObserver {
  constructor(public cb: ResizeObserverCallback) {}
  observe = observeMock;
  disconnect = disconnectMock;
  unobserve = vi.fn();
}

describe('useScrollHint', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('ResizeObserver', MockResizeObserver);
  });

  it('returns false if ref is null', () => {
    const ref = { current: null };
    const { result } = renderHook(() => useScrollHint(ref));
    expect(result.current).toBe(false);
  });

  it('detects overflow correctly', () => {
    const el = {
      scrollHeight: 1000,
      clientHeight: 100,
      scrollTop: 0,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as any;
    const ref = { current: el };
    const { result } = renderHook(() => useScrollHint(ref));

    expect(result.current).toBe(true);
    expect(observeMock).toHaveBeenCalledWith(el);
    expect(el.addEventListener).toHaveBeenCalledWith('scroll', expect.any(Function), {
      passive: true,
    });
  });

  it('returns false when at bottom', () => {
    const el = {
      scrollHeight: 1000,
      clientHeight: 100,
      scrollTop: 900,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as any;
    const ref = { current: el };
    const { result } = renderHook(() => useScrollHint(ref));

    expect(result.current).toBe(false);
  });

  it('updates state on scroll event', () => {
    const el = {
      scrollHeight: 1000,
      clientHeight: 100,
      scrollTop: 0,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as any;
    const ref = { current: el };
    const { result } = renderHook(() => useScrollHint(ref));

    expect(result.current).toBe(true);

    act(() => {
      el.scrollTop = 900;
      const handler = el.addEventListener.mock.calls[0][1];
      handler();
    });

    expect(result.current).toBe(false);
  });

  it('cleans up on unmount', () => {
    const el = {
      scrollHeight: 1000,
      clientHeight: 100,
      scrollTop: 0,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as any;
    const ref = { current: el };
    const { unmount } = renderHook(() => useScrollHint(ref));

    unmount();

    expect(disconnectMock).toHaveBeenCalled();
    expect(el.removeEventListener).toHaveBeenCalled();
  });
});
