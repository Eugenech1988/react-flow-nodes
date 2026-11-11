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
  CircleDot,
  type LucideIcon,
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

export type TDepartment = (typeof DEPARTMENTS)[number]['id'];

export const DEPT_TO_BACKEND: Record<Exclude<TDepartment, 'all'>, string> = {
  engineering: 'ENGINEERING',
  design: 'DESIGN',
  research: 'RESEARCH',
  operations: 'OPERATIONS',
};

const ICON_MAP: Record<string, LucideIcon> = {
  'code-2': Code2,
  cpu: Cpu,
  palette: Palette,
  'flask-conical': FlaskConical,
  cog: Cog,
  briefcase: Briefcase,
  database: Database,
  'pen-tool': PenTool,
  'shield-check': ShieldCheck,
  'trending-up': TrendingUp,
};

export const resolveJobIcon = (name: string | null | undefined): LucideIcon => {
  if (!name) return CircleDot;
  return ICON_MAP[name] ?? CircleDot;
};

export const TYPE_LABELS: Record<string, string> = {
  FULL_TIME: 'Full-time',
  PART_TIME: 'Part-time',
  CONTRACT: 'Contract',
  INTERNSHIP: 'Internship',
};

export const LEVEL_LABELS: Record<string, string> = {
  JUNIOR: 'Junior',
  MID: 'Mid',
  SENIOR: 'Senior',
  LEAD: 'Lead',
};

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
