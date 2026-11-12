import { render, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { Odometer } from './CareersOdometer';

let observerCallback: IntersectionObserverCallback;
const observeMock = vi.fn();
const disconnectMock = vi.fn();

class MockIntersectionObserver {
  constructor(cb: IntersectionObserverCallback) {
    observerCallback = cb;
  }
  observe = observeMock;
  disconnect = disconnectMock;
  unobserve = vi.fn();
  takeRecords = vi.fn();
  root = null;
  rootMargin = '';
  thresholds = [];
}
vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);

describe('CareersOdometer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    Element.prototype.getBoundingClientRect = () => ({
      top: 0,
      bottom: 0,
      height: 0,
      width: 0,
      left: 0,
      right: 0,
      x: 0,
      y: 0,
      toJSON: () => {},
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 768,
    });
  });

  it('renders immediately if in viewport (vh > 0)', () => {
    Element.prototype.getBoundingClientRect = vi.fn(() => ({
      top: 100,
      bottom: 200,
      height: 100,
      width: 100,
      left: 0,
      right: 0,
      x: 0,
      y: 0,
      toJSON: () => {},
    }));
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 1000,
    });

    render(<Odometer value="5" />);
    expect(observeMock).not.toHaveBeenCalled();
  });

  it('falls back to documentElement.clientHeight when innerHeight is 0', () => {
    Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 0 });
    Object.defineProperty(document.documentElement, 'clientHeight', {
      writable: true,
      configurable: true,
      value: 1000,
    });
    Element.prototype.getBoundingClientRect = vi.fn(() => ({
      top: 100,
      bottom: 200,
      height: 100,
      width: 100,
      left: 0,
      right: 0,
      x: 0,
      y: 0,
      toJSON: () => {},
    }));

    render(<Odometer value="5" />);
    expect(observeMock).not.toHaveBeenCalled();
  });

  it('creates observer if top < vh + 400 but bottom <= -400 (covers second && branch)', () => {
    Element.prototype.getBoundingClientRect = vi.fn(() => ({
      top: 100,
      bottom: -500,
      height: 100,
      width: 100,
      left: 0,
      right: 0,
      x: 0,
      y: 0,
      toJSON: () => {},
    }));
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 1000,
    });

    render(<Odometer value="5" />);
    expect(observeMock).toHaveBeenCalled();
  });

  it('creates observer if out of viewport and handles intersection', () => {
    Element.prototype.getBoundingClientRect = vi.fn(() => ({
      top: 2000,
      bottom: 2100,
      height: 100,
      width: 100,
      left: 0,
      right: 0,
      x: 0,
      y: 0,
      toJSON: () => {},
    }));
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 1000,
    });

    const { unmount } = render(<Odometer value="5" />);

    act(() => {
      observerCallback([{ isIntersecting: true }] as any, {} as any);
    });

    expect(disconnectMock).toHaveBeenCalled();
    unmount();
  });

  it('cleans up on unmount without intersection', () => {
    Element.prototype.getBoundingClientRect = vi.fn(() => ({
      top: 2000,
      bottom: 2100,
      height: 100,
      width: 100,
      left: 0,
      right: 0,
      x: 0,
      y: 0,
      toJSON: () => {},
    }));
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 1000,
    });

    const { unmount } = render(<Odometer value="5" />);
    unmount();

    expect(disconnectMock).toHaveBeenCalled();
  });
});
