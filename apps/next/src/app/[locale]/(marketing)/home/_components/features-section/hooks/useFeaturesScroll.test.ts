import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useFeaturesScroll } from './useFeaturesScroll';

// Мокаем TOTAL_STEPS = 7 для предсказуемых расчетов
vi.mock('../constants', () => ({
  TOTAL_STEPS: 7,
}));

type TMockMediaQueryList = {
  matches: boolean;
  media: string;
  onchange: null;
  addListener: ReturnType<typeof vi.fn>;
  removeListener: ReturnType<typeof vi.fn>;
  addEventListener: ReturnType<typeof vi.fn>;
  removeEventListener: ReturnType<typeof vi.fn>;
  dispatchEvent: ReturnType<typeof vi.fn>;
};

const createMockMedia = (matches: boolean): TMockMediaQueryList => ({
  matches,
  media: '(min-width: 1024px)',
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
});

const mockElement = (offsetHeight: number, offsetTop: number) => ({
  offsetHeight,
  offsetTop,
});

describe('useFeaturesScroll', () => {
  let originalMatchMedia: typeof window.matchMedia;
  let originalRAF: typeof window.requestAnimationFrame;
  let originalCAF: typeof window.cancelAnimationFrame;
  let originalScrollTo: typeof window.scrollTo;
  let mockMedia: TMockMediaQueryList;

  beforeEach(() => {
    originalMatchMedia = window.matchMedia;
    originalRAF = window.requestAnimationFrame;
    originalCAF = window.cancelAnimationFrame;
    originalScrollTo = window.scrollTo;

    window.scrollTo = vi.fn();
    window.requestAnimationFrame = vi.fn((cb) => {
      cb(0);
      return 1;
    });
    window.cancelAnimationFrame = vi.fn();

    // По умолчанию десктоп
    mockMedia = createMockMedia(true);
    window.matchMedia = vi.fn().mockReturnValue(mockMedia);

    Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 500 });
    Object.defineProperty(window, 'scrollY', { writable: true, configurable: true, value: 0 });
    Object.defineProperty(document, 'readyState', { writable: true, configurable: true, value: 'complete' });
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
    window.requestAnimationFrame = originalRAF;
    window.cancelAnimationFrame = originalCAF;
    window.scrollTo = originalScrollTo;
    vi.clearAllMocks();
  });

  it('sets ready=true and index=0 immediately on mobile (non-desktop)', () => {
    window.matchMedia = vi.fn().mockReturnValue(createMockMedia(false));
    const { result } = renderHook(() => useFeaturesScroll());

    expect(result.current.ready).toBe(true);
    expect(result.current.index).toBe(0);
    expect(window.requestAnimationFrame).not.toHaveBeenCalled();
  });

  it('handles document.readyState !== complete (waits for load)', () => {
    Object.defineProperty(document, 'readyState', { writable: true, value: 'loading' });
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener');

    renderHook(() => useFeaturesScroll());

    expect(addEventListenerSpy).toHaveBeenCalledWith('load', expect.any(Function), { once: true });
  });

  it('computes index correctly and sets ready after RAF checks', () => {
    const { result } = renderHook(() => useFeaturesScroll());

    // Симулируем, что wrapperRef получил DOM-элемент
    Object.defineProperty(result.current.wrapperRef, 'current', {
      value: mockElement(1000, 0),
    });

    // Симулируем скролл до середины
    window.scrollY = 250;
    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });

    // progress = 250 / (1000 - 500) = 0.5
    // index = floor(0.5 * 7) = 3
    expect(result.current.index).toBe(3);
  });

  it('does nothing on scroll if scrollableHeight <= 0', () => {
    const { result } = renderHook(() => useFeaturesScroll());
    Object.defineProperty(result.current.wrapperRef, 'current', {
      value: mockElement(400, 0), // меньше чем innerHeight(500)
    });

    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });

    expect(result.current.index).toBe(0);
  });

  describe('goToStep', () => {
    it('sets index directly on mobile', () => {
      window.matchMedia = vi.fn().mockReturnValue(createMockMedia(false));
      const { result } = renderHook(() => useFeaturesScroll());

      act(() => {
        result.current.goToStep(4);
      });

      expect(result.current.index).toBe(4);
    });

    it('calls window.scrollTo on desktop', () => {
      const { result } = renderHook(() => useFeaturesScroll());
      Object.defineProperty(result.current.wrapperRef, 'current', {
        value: mockElement(1000, 100),
      });

      act(() => {
        result.current.goToStep(3); // 3 / (7-1) = 0.5
      });

      // scrollableHeight = 1000 - 500 = 500
      // targetProgress = 3 / 6 = 0.5
      // top = 100 + 0.5 * 500 = 350
      expect(window.scrollTo).toHaveBeenCalledWith({
        top: 350,
        behavior: 'smooth',
      });
    });

    it('returns early in goToStep if element is null', () => {
      const { result } = renderHook(() => useFeaturesScroll());
      // ref.current = null by default

      act(() => {
        result.current.goToStep(3);
      });

      expect(window.scrollTo).not.toHaveBeenCalled();
    });

    it('returns early in goToStep if scrollableHeight <= 0', () => {
      const { result } = renderHook(() => useFeaturesScroll());
      Object.defineProperty(result.current.wrapperRef, 'current', {
        value: mockElement(400, 0),
      });

      act(() => {
        result.current.goToStep(3);
      });

      expect(window.scrollTo).not.toHaveBeenCalled();
    });
  });

  it('handles media query change from desktop to mobile', () => {
    const { result } = renderHook(() => useFeaturesScroll());

    const onChange = vi.mocked(mockMedia.addEventListener).mock.calls.find(
      ([event]) => event === 'change'
    )?.[1] as (e: MediaQueryListEvent) => void;

    act(() => {
      onChange({ matches: false } as MediaQueryListEvent);
    });

    expect(result.current.index).toBe(0);
    expect(result.current.ready).toBe(true);
  });

  it('cleans up load listener on unmount if readyState !== complete', () => {
    Object.defineProperty(document, 'readyState', { writable: true, value: 'loading' });
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

    const { unmount } = renderHook(() => useFeaturesScroll());
    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('load', expect.any(Function));
  });
});
