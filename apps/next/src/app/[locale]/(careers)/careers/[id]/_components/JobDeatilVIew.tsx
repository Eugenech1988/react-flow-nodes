'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Activity, ArrowLeft } from 'lucide-react';
import { Reveal, MonitorFrame } from '@/shared/ui';
import type { TPublicJob } from '@/shared/api';
import { useT } from '@/shared/lib/i18n/client';
import { LEVEL_LABELS, TYPE_LABELS, resolveJobIcon } from '../../constants';
import { JobHeader } from './JobHeader';
import { JobBody } from './JobBody';
import { JobSidebar } from './JobSidebar';
import { JobApplicationForm } from './JobApplicationForm';

interface IJobDetailProps {
  job: TPublicJob;
  locale: string;
}

export const JobDetailView = ({ job, locale }: IJobDetailProps) => {
  const { t } = useT('careers');
  const [applicationsCount, setApplicationsCount] = useState(Number(job.applications) || 0);

  useEffect(() => {
    setApplicationsCount(Number(job.applications) || 0);
  }, [job.applications]);

  const Icon = resolveJobIcon(job.icon);
  const deptLabel = t(`openings.filters.${job.department.toLowerCase()}`, {
    defaultValue: job.department,
  });
  const typeLabel = t(`openings.types.${job.type}`, {
    defaultValue: TYPE_LABELS[job.type] ?? job.type,
  });
  const levelLabel = t(`openings.levels.${job.level}`, {
    defaultValue: LEVEL_LABELS[job.level] ?? job.level,
  });

  const scrollToForm = () => {
    document.getElementById('apply-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative z-10 mx-auto max-w-7xl px-4 pt-28 pb-0 sm:px-6">
      <Reveal>
        <Link
          href={`/${locale}/careers`}
          className="mb-8 inline-flex items-center gap-2 font-mono text-[10px] tracking-widest text-[#8a9488] uppercase transition-colors hover:text-[#9cc4b0]"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('details.returnToOpenings')}
        </Link>
      </Reveal>

      <div className="flex flex-col gap-12">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_320px] lg:gap-12">
          <Reveal className="relative">
            <MonitorFrame
              theme="careers"
              headerIcon={Activity}
              headerTitle={`SYS.DOSSIER // ${job.slug.toUpperCase()}`}
              footer={
                <div className="flex w-full items-center justify-between font-mono text-[10px] tracking-widest text-[#8a9488] uppercase">
                  <span className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#6fa28c]" />
                    FILE DECRYPTED
                  </span>
                  <span>PAGE 01 / 01</span>
                </div>
              }
            >
              <div className="relative overflow-hidden p-5 sm:p-10">
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(111,162,140,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(111,162,140,0.03)_1px,transparent_1px)] bg-size-[30px_30px]" />

                <div className="relative z-10">
                  <JobHeader
                    job={job}
                    deptLabel={deptLabel}
                    typeLabel={typeLabel}
                    levelLabel={levelLabel}
                    applicationsCount={applicationsCount}
                  />

                  <JobBody job={job} scrollToForm={scrollToForm} />
                </div>
              </div>
            </MonitorFrame>
          </Reveal>

          <JobSidebar job={job} Icon={Icon} scrollToForm={scrollToForm} />
        </div>

        <Reveal delay={100} className="relative">
          <div id="apply-form" className="scroll-mt-32">
            <JobApplicationForm
              job={job}
              locale={locale}
              setApplicationsCount={setApplicationsCount}
            />
          </div>
        </Reveal>
      </div>
    </div>
  );
};
