import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { useInView } from './use-in-view';

class MockIO {
  static instances: MockIO[] = [];
  cb: IntersectionObserverCallback;
  observe = vi.fn();
  disconnect = vi.fn();
  unobserve = vi.fn();
  takeRecords = vi.fn(() => []);
  root = null;
  rootMargin = '';
  thresholds: number[] = [];

  constructor(cb: IntersectionObserverCallback, opts?: IntersectionObserverInit) {
    this.cb = cb;
    if (opts?.rootMargin) this.rootMargin = opts.rootMargin;
    if (opts?.threshold !== undefined) {
      this.thresholds = Array.isArray(opts.threshold) ? opts.threshold : [opts.threshold];
    }
    MockIO.instances.push(this);
  }

  trigger(isIntersecting: boolean) {
    this.cb(
      [{ isIntersecting } as IntersectionObserverEntry],
      this as unknown as IntersectionObserver,
    );
  }
}

const TestComponent = ({ options }: { options?: IntersectionObserverInit }) => {
  const { ref, inView } = useInView<HTMLDivElement>(options);
  return (
    <div ref={ref} data-testid="target">
      {inView ? 'in' : 'out'}
    </div>
  );
};

beforeEach(() => {
  MockIO.instances = [];
  vi.stubGlobal('IntersectionObserver', MockIO);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('useInView', () => {
  it('starts with inView=false', () => {
    render(<TestComponent />);
    expect(screen.getByTestId('target')).toHaveTextContent('out');
  });

  it('sets inView=true on intersect', () => {
    render(<TestComponent />);
    const io = MockIO.instances[0];
    act(() => io.trigger(true));
    expect(screen.getByTestId('target')).toHaveTextContent('in');
  });

  it('stays false on non-intersecting entry', () => {
    render(<TestComponent />);
    const io = MockIO.instances[0];
    act(() => io.trigger(false));
    expect(screen.getByTestId('target')).toHaveTextContent('out');
  });

  it('disconnects observer after first intersect', () => {
    render(<TestComponent />);
    const io = MockIO.instances[0];
    act(() => io.trigger(true));
    expect(io.disconnect).toHaveBeenCalled();
  });

  it('passes default options to IntersectionObserver', () => {
    render(<TestComponent />);
    const io = MockIO.instances[0];
    expect(io.rootMargin).toBe('0px 0px -80px 0px');
    expect(io.thresholds).toEqual([0.15]);
  });

  it('accepts custom options', () => {
    render(<TestComponent options={{ threshold: 0.5, rootMargin: '100px' }} />);
    const io = MockIO.instances[0];
    expect(io.rootMargin).toBe('100px');
    expect(io.thresholds).toEqual([0.5]);
  });

  it('handles missing element safely', () => {
    const NoRefComponent = () => {
      const { inView } = useInView<HTMLDivElement>();
      return <div data-testid="no-ref">{inView ? 'in' : 'out'}</div>;
    };
    render(<NoRefComponent />);
    expect(screen.getByTestId('no-ref')).toHaveTextContent('out');
  });

  it('disconnects on unmount', () => {
    const { unmount } = render(<TestComponent />);
    const io = MockIO.instances[0];
    unmount();
    expect(io.disconnect).toHaveBeenCalled();
  });
});
