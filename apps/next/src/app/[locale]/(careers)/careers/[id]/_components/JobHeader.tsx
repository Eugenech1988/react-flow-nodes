'use client';

import { MapPin, Clock, Target, Eye, FileText } from 'lucide-react';
import { Badge } from '@/shared/ui';
import { useT } from '@/shared/lib/i18n/client';
import type { TPublicJob } from '@/shared/api';

interface IJobHeaderProps {
  job: TPublicJob;
  deptLabel: string;
  typeLabel: string;
  levelLabel: string;
  applicationsCount: number;
}

export const JobHeader = ({
  job,
  deptLabel,
  typeLabel,
  levelLabel,
  applicationsCount,
}: IJobHeaderProps) => {
  const { t } = useT('careers');

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Badge variant="hex" theme="careers">
          {deptLabel}
        </Badge>
        <span className="text-theme-dim font-mono text-[10px] tracking-widest uppercase">
          {t('details.ref', { length: job.slug.length })}
        </span>
      </div>

      <h1 className="font-typewriter text-theme-fg mb-6 text-2xl font-bold tracking-tight break-words uppercase sm:text-4xl md:text-5xl">
        {job.title}
      </h1>

      <div className="border-theme-line text-theme-muted mb-8 flex flex-wrap items-center gap-x-3 gap-y-2 border-y border-dashed py-4 font-mono text-[10px] tracking-widest uppercase sm:gap-x-4 sm:text-xs">
        <span className="flex items-center gap-1.5">
          <MapPin className="text-theme-accent h-3.5 w-3.5" />
          {job.location}
        </span>
        <span className="text-theme-dim hidden sm:inline">/</span>
        <span className="flex items-center gap-1.5">
          <Clock className="text-theme-accent h-3.5 w-3.5" />
          {typeLabel}
        </span>
        <span className="text-theme-dim hidden sm:inline">/</span>
        <span className="flex items-center gap-1.5">
          <Target className="text-theme-accent h-3.5 w-3.5" />
          {levelLabel}
        </span>
        <span className="text-theme-dim hidden sm:inline">/</span>
        <span className="flex items-center gap-1.5">
          <Eye className="text-theme-accent h-3.5 w-3.5" />
          {t('details.views', { count: job.views ?? 0 })}
        </span>
        <span className="text-theme-dim hidden sm:inline">/</span>
        <span className="flex items-center gap-1.5">
          <FileText className="text-theme-accent h-3.5 w-3.5" />
          {t('details.applications', { count: applicationsCount })}
        </span>
      </div>
    </>
  );
};
