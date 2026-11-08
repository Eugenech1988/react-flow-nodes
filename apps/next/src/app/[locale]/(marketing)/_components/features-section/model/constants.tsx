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
];

export type TSlide = { kind: 'feature'; id: string; icon: LucideIcon } | { kind: 'cta' };

export const SLIDES: TSlide[] = [
  ...FEATURES.map((f): TSlide => ({ kind: 'feature', id: f.id, icon: f.icon })),
  { kind: 'cta' },
];

export const TOTAL_STEPS = SLIDES.length;
