import { AlertCircle, Send, Archive, AlertTriangle } from 'lucide-react';
import type { TStatusConfigItem } from '@/shared/ui';
import type { TJobStatus } from './types';

export const STATUS_CONFIG: Record<TJobStatus, TStatusConfigItem> = {
  DRAFT: {
    label: 'Draft',
    icon: AlertCircle,
    className:
      'bg-zinc-500/10 text-zinc-600 border-zinc-500/30 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700',
  },
  PUBLISHED: {
    label: 'Published',
    icon: Send,
    className: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30',
  },
  ARCHIVED: {
    label: 'Archived',
    icon: Archive,
    className: 'bg-red-500/10 text-red-500 border-red-500/30',
  },
};

export const FALLBACK_STATUS: TStatusConfigItem = {
  label: 'Unknown',
  icon: AlertTriangle,
  className: 'bg-muted text-muted-foreground border-border',
};

export const DEFAULT_PAGE_LIMIT = 10;

export const DEPT_OPTIONS = [
  { value: 'ENGINEERING', label: 'Engineering' },
  { value: 'DESIGN', label: 'Design' },
  { value: 'RESEARCH', label: 'Research' },
  { value: 'OPERATIONS', label: 'Operations' },
];

export const LEVEL_OPTIONS = [
  { value: 'JUNIOR', label: 'Junior' },
  { value: 'MID', label: 'Mid' },
  { value: 'SENIOR', label: 'Senior' },
  { value: 'LEAD', label: 'Lead' },
];

export const TYPE_OPTIONS = [
  { value: 'FULL_TIME', label: 'Full-time' },
  { value: 'PART_TIME', label: 'Part-time' },
  { value: 'CONTRACT', label: 'Contract' },
  { value: 'INTERNSHIP', label: 'Internship' },
];

export const STATUS_OPTIONS = [
  { value: 'DRAFT', label: 'Draft' },
  { value: 'PUBLISHED', label: 'Published' },
  { value: 'ARCHIVED', label: 'Archived' },
];
