import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useThrottledScroll } from './use-throttled-scroll';

describe('useThrottledScroll', () => {
  let rafCallbacks: FrameRequestCallback[] = [];
  let originalRAF: typeof window.requestAnimationFrame;

  beforeEach(() => {
    originalRAF = window.requestAnimationFrame;
    rafCallbacks = [];
    window.requestAnimationFrame = vi.fn((cb) => {
      rafCallbacks.push(cb);
      return rafCallbacks.length;
    });
  });

  afterEach(() => {
    window.requestAnimationFrame = originalRAF;
    vi.clearAllMocks();
  });

  it('calls callback via RAF on scroll', () => {
    const callback = vi.fn();
    renderHook(() => useThrottledScroll(callback));

    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });

    expect(rafCallbacks.length).toBe(1);
    expect(callback).not.toHaveBeenCalled();

    act(() => {
      rafCallbacks[0](0);
    });

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('throttles multiple scroll events', () => {
    const callback = vi.fn();
    renderHook(() => useThrottledScroll(callback));

    act(() => {
      window.dispatchEvent(new Event('scroll'));
      window.dispatchEvent(new Event('scroll'));
      window.dispatchEvent(new Event('scroll'));
    });

    expect(rafCallbacks.length).toBe(1);

    act(() => {
      rafCallbacks[0](0);
    });

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('cleans up on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
    const callback = vi.fn();
    const { unmount } = renderHook(() => useThrottledScroll(callback));

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
    removeEventListenerSpy.mockRestore();
  });
});
