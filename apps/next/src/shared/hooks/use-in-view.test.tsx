import { render, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useInView } from './use-in-view';

describe('useInView', () => {
  let capturedCallback: IntersectionObserverCallback | null = null;
  const observeMock = vi.fn();
  const disconnectMock = vi.fn();

  beforeEach(() => {
    capturedCallback = null;
    vi.clearAllMocks();

    class MockIO {
      observe = observeMock;
      disconnect = disconnectMock;
      unobserve = vi.fn();
      takeRecords = vi.fn(() => []);
      root = null;
      rootMargin = '';
      thresholds = [];

      constructor(cb: IntersectionObserverCallback) {
        capturedCallback = cb;
      }
    }

    vi.stubGlobal('IntersectionObserver', MockIO);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('does not create observer when ref is null', () => {
    const Test = () => {
      useInView<HTMLDivElement>();
      return null;
    };
    render(<Test />);
    expect(capturedCallback).toBeNull();
  });

  it('creates observer when div is mounted and observes element', () => {
    const Test = () => {
      const { ref } = useInView<HTMLDivElement>();
      return <div ref={ref} data-testid="target" />;
    };
    const { getByTestId } = render(<Test />);

    expect(capturedCallback).not.toBeNull();
    expect(observeMock).toHaveBeenCalledWith(getByTestId('target'));
  });

  it('sets inView = true on intersection and disconnects', () => {
    let inViewValue = false;
    const Test = () => {
      const { ref, inView } = useInView<HTMLDivElement>();
      inViewValue = inView;
      return <div ref={ref} data-testid="target" />;
    };
    render(<Test />);

    expect(inViewValue).toBe(false);

    act(() => {
      capturedCallback!([{ isIntersecting: true } as any], {} as any);
    });

    expect(inViewValue).toBe(true);
    expect(disconnectMock).toHaveBeenCalled();
  });

  it('does not set inView on non-intersection', () => {
    let inViewValue = false;
    const Test = () => {
      const { ref, inView } = useInView<HTMLDivElement>();
      inViewValue = inView;
      return <div ref={ref} data-testid="target" />;
    };
    render(<Test />);

    act(() => {
      capturedCallback!([{ isIntersecting: false } as any], {} as any);
    });

    expect(inViewValue).toBe(false);
    expect(disconnectMock).not.toHaveBeenCalled();
  });
});
