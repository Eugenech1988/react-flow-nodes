import { Network, Sliders, Play, Activity, Flame } from 'lucide-react';

export const HOW_IT_WORKS_STEPS = [
  { id: 'design', icon: Network },
  { id: 'validate', icon: Sliders },
  { id: 'deploy', icon: Play },
  { id: 'monitor', icon: Activity },
  { id: 'scale', icon: Flame },
] as const;
