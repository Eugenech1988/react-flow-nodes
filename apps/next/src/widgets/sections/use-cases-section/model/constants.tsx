import type { Variants } from 'framer-motion';
import { BrainCircuit, Send, ShieldBan, Workflow } from 'lucide-react';

export const USE_CASES = [
  { id: '01', icon: BrainCircuit, rotation: '-rotate-1', offset: 'md:-mt-4' },
  { id: '02', icon: Send, rotation: 'rotate-2', offset: 'md:mt-20' },
  { id: '03', icon: Workflow, rotation: 'rotate-1', offset: 'md:-mt-8' },
  { id: '04', icon: ShieldBan, rotation: '-rotate-2', offset: 'md:mt-16' },
];

export const UC_CONTAINER_VARIANTS: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

export const UC_CARD_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 60, scale: 0.95 },
  visible: (custom: { rot: string }) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    rotate: custom.rot.includes('-') ? -1.5 : 1.5,
    transition: { type: 'spring', stiffness: 70, damping: 15 },
  }),
};