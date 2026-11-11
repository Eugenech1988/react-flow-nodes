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
        <Badge variant="hex" theme="careers">{deptLabel}</Badge>
        <span className="font-mono text-[10px] tracking-widest text-[#4a5c52] uppercase">
          {t('details.ref', { length: job.slug.length })}
        </span>
      </div>

      <h1 className="font-typewriter mb-6 text-2xl font-bold tracking-tight text-[#d4cfc0] uppercase break-words sm:text-4xl md:text-5xl">
        {job.title}
      </h1>

      <div className="mb-8 flex flex-wrap items-center gap-x-3 gap-y-2 border-y border-dashed border-[#2f3d36] py-4 font-mono text-[10px] tracking-widest text-[#8a9488] uppercase sm:gap-x-4 sm:text-xs">
        <span className="flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-[#6fa28c]" />
          {job.location}
        </span>
        <span className="hidden text-[#2f3d36] sm:inline">/</span>
        <span className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 text-[#6fa28c]" />
          {typeLabel}
        </span>
        <span className="hidden text-[#2f3d36] sm:inline">/</span>
        <span className="flex items-center gap-1.5">
          <Target className="h-3.5 w-3.5 text-[#6fa28c]" />
          {levelLabel}
        </span>
        <span className="hidden text-[#2f3d36] sm:inline">/</span>
        <span className="flex items-center gap-1.5">
          <Eye className="h-3.5 w-3.5 text-[#6fa28c]" />
          {t('details.views', { count: job.views ?? 0 })}
        </span>
        <span className="hidden text-[#2f3d36] sm:inline">/</span>
        <span className="flex items-center gap-1.5">
          <FileText className="h-3.5 w-3.5 text-[#6fa28c]" />
          {t('details.applications', { count: applicationsCount })}
        </span>
      </div>
    </>
  );
};
