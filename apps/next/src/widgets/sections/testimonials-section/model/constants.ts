import type { Variants } from 'framer-motion';

export const TESTIMONIALS_DATA = [
  { id: '1', initials: 'SC', rotation: '-rotate-1' },
  { id: '2', initials: 'MT', rotation: 'rotate-1' },
  { id: '3', initials: 'ER', rotation: '-rotate-1' },
];

export const TESTIMONIALS_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 80, damping: 20 },
  },
};

export const CONTAINER_VARIANTS: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};
