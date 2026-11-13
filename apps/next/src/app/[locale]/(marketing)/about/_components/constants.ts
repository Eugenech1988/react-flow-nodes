import { Cog, Zap, ShieldCheck } from 'lucide-react';

export const VALUES = [
  { id: '1', Icon: Cog, number: '01' },
  { id: '2', Icon: Zap, number: '02' },
  { id: '3', Icon: ShieldCheck, number: '03' },
] as const;

export const CREW = [
  { id: '1', avatar: 'https://i.pravatar.cc/150?u=eugene' },
  { id: '2', avatar: 'https://i.pravatar.cc/150?u=jane' },
  { id: '3', avatar: 'https://i.pravatar.cc/150?u=marcus' },
  { id: '4', avatar: 'https://i.pravatar.cc/150?u=elena' },
  { id: '5', avatar: 'https://i.pravatar.cc/150?u=viktor' },
  { id: '6', avatar: 'https://i.pravatar.cc/150?u=sarah' },
] as const;

export const RIVET_POSITIONS = [
  'top-3 left-3 sm:top-4 sm:left-4',
  'top-3 right-3 sm:top-4 sm:right-4',
  'bottom-3 left-3 sm:bottom-4 sm:left-4',
  'right-3 bottom-3 sm:right-4 sm:bottom-4',
] as const;

export const FRAME_CLASS =
  'relative rounded-3xl border border-[#2dd4bf]/30 bg-[#0a1210]/90 p-1.5 shadow-[inset_0_0_50px_rgba(0,0,0,0.8),0_20px_40px_rgba(0,0,0,0.5)] sm:p-2';

export const SCREEN_CLASS =
  'relative flex flex-col overflow-hidden rounded-[1.4rem] border border-slate-800 bg-slate-950/90';

export const BAR_CLASS =
  'relative z-10 flex items-center justify-between bg-[#0d1f1e] px-4 py-3 sm:px-6';

export const DOTS_GRID_CLASS =
  'pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(45,212,191,0.08)_1px,transparent_1.5px)] bg-size-[16px_16px]';
