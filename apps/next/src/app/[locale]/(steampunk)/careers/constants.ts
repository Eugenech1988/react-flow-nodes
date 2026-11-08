import {
  Globe,
  GraduationCap,
  Heart,
  Clock,
  Coffee,
  Cpu,
  Feather,
  Compass,
  Users,
  FlaskConical,
  Rocket,
  Code2,
  Cog,
  Layers,
  Palette,
  Briefcase,
  Database,
  ShieldCheck,
  TrendingUp,
  PenTool,
} from 'lucide-react';
import { round4 } from '@/shared/lib';

export const CAREERS_STATS = [
  { id: '1', icon: Code2 },
  { id: '2', icon: Globe },
  { id: '3', icon: Layers },
  { id: '4', icon: Users },
];

export const DEPARTMENTS = [
  { id: 'all' },
  { id: 'engineering' },
  { id: 'design' },
  { id: 'research' },
  { id: 'operations' },
];

export type Department = (typeof DEPARTMENTS)[number]['id'];

export const JOBS = [
  { id: 'senior-frontend', dept: 'engineering', icon: Code2 },
  { id: 'backend-engineer', dept: 'engineering', icon: Cpu },
  { id: 'product-designer', dept: 'design', icon: Palette },
  { id: 'ml-researcher', dept: 'research', icon: FlaskConical },
  { id: 'devops-engineer', dept: 'engineering', icon: Cog },
  { id: 'talent-partner', dept: 'operations', icon: Briefcase },
  { id: 'data-engineer', dept: 'engineering', icon: Database },
  { id: 'ux-writer', dept: 'design', icon: PenTool },
  { id: 'security-engineer', dept: 'engineering', icon: ShieldCheck },
  { id: 'growth-manager', dept: 'operations', icon: TrendingUp },
];

export const PERKS = [
  { id: '1', icon: Globe },
  { id: '2', icon: GraduationCap },
  { id: '3', icon: Heart },
  { id: '4', icon: Clock },
  { id: '5', icon: Coffee },
  { id: '6', icon: Cpu },
];

export const PROCESS_STEPS = [
  { id: 'apply', icon: Feather },
  { id: 'screen', icon: Compass },
  { id: 'interview', icon: Users },
  { id: 'craft', icon: FlaskConical },
  { id: 'offer', icon: Rocket },
];

export const MAX_VACANCIES = 50;

export const TICKS = Array.from({ length: 21 }).map((_, i) => {
  const angle = ((i * 9 - 180) * Math.PI) / 180;
  const isMajor = i % 5 === 0;
  const inner = isMajor ? 34 : 38;
  return {
    i,
    isMajor,
    x1: round4(50 + Math.cos(angle) * inner),
    y1: round4(50 + Math.sin(angle) * inner),
    x2: round4(50 + Math.cos(angle) * 44),
    y2: round4(50 + Math.sin(angle) * 44),
  };
});

export const RIVETS = [45, 135, 225, 315].map((deg) => {
  const rad = ((deg - 90) * Math.PI) / 180;
  return {
    deg,
    top: round4(50 + Math.sin(rad) * 50),
    left: round4(50 + Math.cos(rad) * 50),
  };
});
