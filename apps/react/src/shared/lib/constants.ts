import type { Variants } from 'framer-motion';
import type { TRoundedSize } from '@/shared/lib/types.ts';

export const PAGE_VARIANTS: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.21, 1.02, 0.43, 1.01] },
  },
};

export const SETTINGS_CONTENT_VARIANTS: Variants = {
  initial: (isInitial: boolean) => ({
    opacity: isInitial ? 1 : 0,
    y: isInitial ? 0 : 8,
  }),
  animate: {
    opacity: 1,
    y: 0,
  },
};

export const ROUNDED_MAP: Record<TRoundedSize, string> = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  full: 'rounded-full',
};