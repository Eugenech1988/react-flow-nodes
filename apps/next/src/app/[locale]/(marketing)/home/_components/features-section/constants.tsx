import {
  CloudLightning,
  MousePointer,
  Network,
  ShieldCheck,
  Users,
  Zap,
  type LucideIcon,
} from 'lucide-react';

export const FEATURES = [
  { id: 'visual-editor', icon: Network },
  { id: 'event-triggers', icon: Zap },
  { id: 'zero-lag', icon: MousePointer },
  { id: 'schema-control', icon: ShieldCheck },
  { id: 'collaborative-rooms', icon: Users },
  { id: 'one-click-deploy', icon: CloudLightning },
] as const;

export type TFeatureId = (typeof FEATURES)[number]['id'];

export type TSlide =
  | { kind: 'feature'; id: TFeatureId; icon: LucideIcon }
  | { kind: 'cta' };

export const SLIDES: TSlide[] = [
  ...FEATURES.map((f): TSlide => ({ kind: 'feature', id: f.id, icon: f.icon })),
  { kind: 'cta' },
];

export const TOTAL_STEPS = SLIDES.length;

export const CROSSHAIRS = ['top-6 left-6', 'top-6 right-6', 'bottom-6 left-6', 'bottom-6 right-6'];

export const GLITCH_BARS_H = [
  { top: '14%', left: '0', width: '8%', delay: '0s' },
  { top: '38%', right: '0', width: '12%', delay: '1s' },
  { top: '62%', left: '5%', width: '15%', delay: '2s' },
  { top: '84%', right: '8%', width: '6%', delay: '0.5s' },
];

export const GLITCH_BARS_V = [
  { left: '8%', top: '20%', height: '6%', delay: '0.8s' },
  { right: '12%', top: '55%', height: '8%', delay: '1.5s' },
];

export const SIGNAL_DOTS = [
  { top: '15%', left: '20%', delay: '0s' },
  { top: '35%', left: '85%', delay: '0.6s' },
  { top: '60%', left: '12%', delay: '1.2s' },
  { top: '75%', left: '90%', delay: '0.3s' },
  { top: '45%', left: '50%', delay: '0.9s' },
];

export const STARTUP_PROBES = 5;
