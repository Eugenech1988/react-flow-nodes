import type { SortingState } from '@tanstack/react-table';
import type { TStatusConfigItem } from '@/shared/ui';
import type { IJob } from './types';
import { STATUS_CONFIG, FALLBACK_STATUS } from './constants';

export type TJobSortKey = 'slug' | 'title' | 'department' | 'locales' | 'status';

export const getEnTitle = (job: IJob): string =>
  job.translations.find((t) => t.locale === 'en')?.title ?? '';

export const getLocalesLabel = (job: IJob): string =>
  job.translations.map((t) => t.locale).join(', ') || '—';

export const getStatusConfig = (status: string): TStatusConfigItem =>
  (STATUS_CONFIG as Record<string, TStatusConfigItem>)[status] ?? FALLBACK_STATUS;

export const getSortValue = (job: IJob, key: TJobSortKey): string => {
  switch (key) {
    case 'slug': return job.slug;
    case 'title': return getEnTitle(job);
    case 'department': return job.department;
    case 'locales': return job.translations.map((t) => t.locale).join(',');
    case 'status': return job.status;
    default: return '';
  }
};

export const sortJobs = (jobs: IJob[], sorting: SortingState): IJob[] => {
  if (!sorting.length) return jobs;
  const { id, desc } = sorting[0];
  const key = id as TJobSortKey;

  return [...jobs].sort((a, b) => {
    const cmp = getSortValue(a, key).localeCompare(getSortValue(b, key));
    return desc ? -cmp : cmp;
  });
};