import type { Variants } from 'framer-motion';

export const PRICING_TIERS = [
  { id: 'hobby', popular: false, href: 'http://localhost:5173' },
  { id: 'pro', popular: true, href: 'http://localhost:5173/login' },
  { id: 'enterprise', popular: false, href: '#' },
];

export const PRICING_CONTAINER_VARIANTS: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

export const PRICING_CARD_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 100, damping: 20 },
  },
};
