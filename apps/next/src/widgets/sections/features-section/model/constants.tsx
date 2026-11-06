import type { TFeature } from './types';
import { CloudLightning, MousePointer, Network, ShieldCheck, Users, Zap } from 'lucide-react';
import type { Variants } from 'framer-motion';

export const FEATURES: TFeature[] = [
  { id: 'visual-editor', icon: Network },
  { id: 'event-triggers', icon: Zap },
  { id: 'zero-lag', icon: MousePointer },
  { id: 'schema-control', icon: ShieldCheck },
  { id: 'collaborative-rooms', icon: Users },
  { id: 'one-click-deploy', icon: CloudLightning },
];

export const SLIDE_VARIANTS: Variants = {
  enter: (dir: number) => ({
    y: dir > 0 ? 120 : -120,
    opacity: 0,
    scale: 0.96,
    filter: 'blur(6px)',
  }),
  center: {
    y: 0,
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
  },
  exit: (dir: number) => ({
    y: dir > 0 ? -120 : 120,
    opacity: 0,
    scale: 0.96,
    filter: 'blur(6px)',
  }),
};