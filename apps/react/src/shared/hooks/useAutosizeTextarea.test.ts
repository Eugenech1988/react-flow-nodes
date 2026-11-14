import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAutosizeTextarea } from './useAutosizeTextarea';

const createTextareaRef = (scrollHeight = 100) => {
  const el = document.createElement('textarea');
  Object.defineProperty(el, 'scrollHeight', {
    configurable: true,
    value: scrollHeight,
  });
  return { current: el };
};

describe('useAutosizeTextarea', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('does nothing when ref is null', () => {
    expect(() =>
      renderHook(() => useAutosizeTextarea({ current: null }, 'x')),
    ).not.toThrow();
  });

  it('resizes on mount', () => {
    const ref = createTextareaRef(120);
    renderHook(() => useAutosizeTextarea(ref, 'hello'));
    expect(ref.current.style.height).toBe('120px');
  });

  it('resizes when value changes', () => {
    const ref = createTextareaRef(50);
    const { rerender } = renderHook(
      ({ value }) => useAutosizeTextarea(ref, value),
      { initialProps: { value: 'a' } },
    );
    expect(ref.current.style.height).toBe('50px');

    Object.defineProperty(ref.current, 'scrollHeight', {
      configurable: true,
      value: 200,
    });
    rerender({ value: 'ab' });
    expect(ref.current.style.height).toBe('200px');
  });

  it('calls onHeightChange callback', () => {
    const onHeightChange = vi.fn();
    const ref = createTextareaRef(80);
    renderHook(() => useAutosizeTextarea(ref, 'text', onHeightChange));
    expect(onHeightChange).toHaveBeenCalledWith(80);
  });

  it('resets height to auto before measuring', () => {
    const ref = createTextareaRef(60);
    ref.current.style.height = '500px';
    renderHook(() => useAutosizeTextarea(ref, 'x'));
    expect(ref.current.style.height).toBe('60px');
  });
});
