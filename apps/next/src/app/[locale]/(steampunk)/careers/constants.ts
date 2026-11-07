import type { Variants } from 'framer-motion';
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
] as const;

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
] as const;

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

export const CAREERS_CONTAINER: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

export const CAREERS_CARD: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};
