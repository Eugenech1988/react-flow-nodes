import type { TFeature } from './types';
import { CloudLightning, MousePointer, Network, ShieldCheck, Users, Zap } from 'lucide-react';
import type { Variants } from 'framer-motion';

export const FEATURES: TFeature[] = [
  {
    title: 'Visual Node Editor',
    badge: 'Interactive',
    description:
      'Design complex data flows effortlessly using drag-and-drop node mechanics with native connection validation and instant reactivity.',
    icon: Network,
  },
  {
    title: 'Event-Driven Triggers',
    badge: 'Real-time',
    description:
      'Execute actions conditionally. Connect custom trigger nodes like <code class="rounded border border-[#2dd4bf]/30 bg-[#06100f] px-1.5 py-0.5 font-mono text-xs text-[#5eead4]">on_click</code> or webhooks to downstream payloads instantly.',
    icon: Zap,
  },
  {
    title: 'Zero-Lag Canvas',
    badge: 'Performance',
    description:
      'Experience ultra-smooth navigation. Fully optimized zoom-locked interactions, hardware-accelerated panning, and layout protection.',
    icon: MousePointer,
  },
  {
    title: 'Strict Schema Control',
    badge: 'Type Safe',
    description:
      'Ensure data integrity between source and target connections. Mismatched node ports block incompatible payloads automatically.',
    icon: ShieldCheck,
  },
  {
    title: 'Collaborative Rooms',
    badge: 'Multiplayer',
    description:
      'Build and debug pipelines together in real-time. Share workspaces with your team instantly with live presence and cursor tracking.',
    icon: Users,
  },
  {
    title: 'One-Click Deploy',
    badge: 'Serverless',
    description:
      'Push your validated nodes to production with a single click. Scale automatically on serverless edge runtimes without cold starts.',
    icon: CloudLightning,
  },
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
