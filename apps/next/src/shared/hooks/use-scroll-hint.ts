import { useState, useEffect, type RefObject } from 'react';

export const useScrollHint = (
  ref: RefObject<HTMLElement | null>,
  threshold = 2,
  bottomOffset = 8,
) => {
  const [showScrollHint, setShowScrollHint] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const checkScrollHint = () => {
      const hasOverflow = el.scrollHeight > el.clientHeight + threshold;
      const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - bottomOffset;
      setShowScrollHint(hasOverflow && !atBottom);
    };

    checkScrollHint();
    const ro = new ResizeObserver(checkScrollHint);
    ro.observe(el);
    el.addEventListener('scroll', checkScrollHint, { passive: true });

    return () => {
      ro.disconnect();
      el.removeEventListener('scroll', checkScrollHint);
    };
  }, [ref, threshold, bottomOffset]);

  return showScrollHint;
};
