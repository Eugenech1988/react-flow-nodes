import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useFeaturesScroll } from './useFeaturesScroll';
import { useThrottledScroll } from '@/shared/hooks';

vi.mock('../constants', () => ({ TOTAL_STEPS: 7, STARTUP_PROBES: 5 }));

vi.mock('@/shared/hooks', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/shared/hooks')>();
  return {
    ...actual,
    useThrottledScroll: vi.fn(),
  };
});

let rafCallbacks: FrameRequestCallback[] = [];
let scrollCallback: (() => void) | undefined;

const flushRAF = () => {
  while (rafCallbacks.length > 0) {
    const cbs = [...rafCallbacks];
    rafCallbacks = [];
    cbs.forEach((cb) => cb(0));
  }
};

describe('useFeaturesScroll', () => {
  let originalMatchMedia: typeof window.matchMedia;
  let originalRAF: typeof window.requestAnimationFrame;
  let originalScrollTo: typeof window.scrollTo;
  let mockMedia: {
    matches: boolean;
    addEventListener: ReturnType<typeof vi.fn>;
    removeEventListener: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    originalMatchMedia = window.matchMedia;
    originalRAF = window.requestAnimationFrame;
    originalScrollTo = window.scrollTo;

    window.scrollTo = vi.fn();
    rafCallbacks = [];
    scrollCallback = undefined;

    window.requestAnimationFrame = vi.fn((cb) => {
      rafCallbacks.push(cb);
      return rafCallbacks.length;
    });
    window.cancelAnimationFrame = vi.fn();

    mockMedia = {
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };
    window.matchMedia = vi.fn().mockReturnValue(mockMedia);

    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 500,
    });
    Object.defineProperty(window, 'scrollY', { writable: true, configurable: true, value: 0 });

    vi.mocked(useThrottledScroll).mockImplementation((cb) => {
      scrollCallback = cb;
    });
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
    window.requestAnimationFrame = originalRAF;
    window.scrollTo = originalScrollTo;
    vi.clearAllMocks();
  });

  it('sets ready=true and index=0 immediately on mobile', () => {
    mockMedia.matches = false;
    const { result } = renderHook(() => useFeaturesScroll());
    expect(result.current.ready).toBe(true);
    expect(result.current.index).toBe(0);
  });

  it('handles cleanup on unmount during RAF', () => {
    const { unmount } = renderHook(() => useFeaturesScroll());
    unmount();
    expect(window.cancelAnimationFrame).toHaveBeenCalled();
  });

  it('runs RAF checks 5 times and sets ready=true', () => {
    const { result } = renderHook(() => useFeaturesScroll());
    act(() => {
      flushRAF();
    });
    expect(result.current.ready).toBe(true);
  });

  it('computes index during startup check if ref is available', () => {
    const { result } = renderHook(() => useFeaturesScroll());
    result.current.wrapperRef.current = { offsetHeight: 1000, offsetTop: 0 } as HTMLElement;
    Object.defineProperty(window, 'innerHeight', { value: 500, configurable: true });
    Object.defineProperty(window, 'scrollY', { value: 250, configurable: true });

    act(() => {
      flushRAF();
    });

    expect(result.current.ready).toBe(true);
    expect(result.current.index).toBe(3);
  });

  it('computes index on scroll (scrollableHeight > 0)', () => {
    const { result } = renderHook(() => useFeaturesScroll());
    act(() => {
      flushRAF();
    });

    result.current.wrapperRef.current = { offsetHeight: 1000, offsetTop: 0 } as HTMLElement;
    Object.defineProperty(window, 'scrollY', { writable: true, value: 250 });

    act(() => {
      if (scrollCallback) scrollCallback();
    });

    expect(result.current.index).toBe(3);
  });

  it('does not update index on scroll when ref is null', () => {
    const { result } = renderHook(() => useFeaturesScroll());
    act(() => {
      flushRAF();
    });

    act(() => {
      if (scrollCallback) scrollCallback();
    });

    expect(result.current.index).toBe(0);
  });

  it('does not update index on scroll when not ready', () => {
    const { result } = renderHook(() => useFeaturesScroll());

    result.current.wrapperRef.current = { offsetHeight: 1000, offsetTop: 0 } as HTMLElement;
    Object.defineProperty(window, 'scrollY', { writable: true, value: 250 });

    act(() => {
      if (scrollCallback) scrollCallback();
    });

    expect(result.current.index).toBe(0);
  });

  it('does not update index on scroll (scrollableHeight <= 0)', () => {
    const { result } = renderHook(() => useFeaturesScroll());
    act(() => {
      flushRAF();
    });

    result.current.wrapperRef.current = { offsetHeight: 400, offsetTop: 0 } as HTMLElement;
    Object.defineProperty(window, 'scrollY', { writable: true, value: 250 });

    act(() => {
      if (scrollCallback) scrollCallback();
    });

    expect(result.current.index).toBe(0);
  });

  it('goToStep on mobile sets index', () => {
    mockMedia.matches = false;
    const { result } = renderHook(() => useFeaturesScroll());
    act(() => result.current.goToStep(3));
    expect(result.current.index).toBe(3);
  });

  it('goToStep on desktop calls scrollTo', () => {
    const { result } = renderHook(() => useFeaturesScroll());
    act(() => {
      flushRAF();
    });
    result.current.wrapperRef.current = { offsetHeight: 1000, offsetTop: 100 } as HTMLElement;
    act(() => result.current.goToStep(3));
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 350, behavior: 'smooth' });
  });

  it('goToStep returns early if ref is null', () => {
    const { result } = renderHook(() => useFeaturesScroll());
    act(() => {
      flushRAF();
    });
    act(() => result.current.goToStep(3));
    expect(window.scrollTo).not.toHaveBeenCalled();
  });

  it('goToStep returns early if scrollableHeight <= 0', () => {
    const { result } = renderHook(() => useFeaturesScroll());
    act(() => {
      flushRAF();
    });
    result.current.wrapperRef.current = { offsetHeight: 400, offsetTop: 100 } as HTMLElement;
    act(() => result.current.goToStep(3));
    expect(window.scrollTo).not.toHaveBeenCalled();
  });

  it('handles media change', () => {
    const { result } = renderHook(() => useFeaturesScroll());
    act(() => {
      flushRAF();
    });
    const onChange = mockMedia.addEventListener.mock.calls[0][1];
    act(() => {
      onChange({ matches: false });
    });
    expect(result.current.index).toBe(0);
    expect(result.current.ready).toBe(true);
  });
});