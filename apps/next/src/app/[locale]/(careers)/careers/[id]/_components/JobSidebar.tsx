'use client';

import { ShieldAlert, Radio, MapPin, Target, Eye, FileText } from 'lucide-react';
import { Frame, Reveal, AppButton } from '@/shared/ui';
import { useT } from '@/shared/lib/i18n/client';
import type { TPublicJob } from '@/shared/api';
import { LEVEL_LABELS } from '../../constants';

interface IJobSidebarProps {
  job: TPublicJob;
  Icon: React.ElementType;
  scrollToForm: () => void;
}

export const JobSidebar = ({ job, Icon, scrollToForm }: IJobSidebarProps) => {
  const { t } = useT('careers');
  const deptLabel = t(`openings.filters.${job.department.toLowerCase()}`, {
    defaultValue: job.department,
  });

  const levelLabel = t(`openings.levels.${job.level}`, {
    defaultValue: LEVEL_LABELS[job.level] ?? job.level,
  });

  return (
    <div className="hidden lg:sticky lg:top-24 lg:block">
      <Reveal delay={150}>
        <Frame
          theme="careers"
          headerIcon={Radio}
          headerTitle="TRANSMIT.DATA"
          footer={
            <div className="text-theme-accent flex items-center gap-2 font-mono text-[9px] tracking-widest uppercase">
              <ShieldAlert className="h-3 w-3" />
              SECURE CHANNEL
            </div>
          }
        >
          <div className="flex flex-col p-6">
            <div className="mb-6 flex items-center gap-4">
              <div className="border-theme-line bg-theme-bg text-theme-accent flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border shadow-[inset_0_0_15px_color-mix(in_oklab,var(--theme-accent)_10%,transparent)]">
                <Icon className="h-8 w-8" />
              </div>

              <div className="border-theme-accent/40 bg-theme-accent/10 text-theme-accent-hover flex h-fit items-center rounded border px-3 py-1.5 font-mono text-[10px] font-bold tracking-widest uppercase shadow-[inset_0_1px_0_color-mix(in_oklab,var(--theme-accent-hover)_20%,transparent)]">
                {deptLabel}
              </div>
            </div>

            <h3 className="font-typewriter text-theme-fg mb-2 text-lg font-bold">
              {t('details.sidebar.title')}
            </h3>
            <p className="text-theme-muted mb-6 font-mono text-xs leading-relaxed">
              {t('details.sidebar.description')}
            </p>

            <div className="border-theme-line/50 bg-theme-bg/30 mb-8 space-y-4 rounded-lg border p-4">
              <div className="text-theme-muted flex items-center gap-3 font-mono text-xs">
                <MapPin className="text-theme-accent h-4 w-4 shrink-0" />
                <span>{job.location}</span>
              </div>
              <div className="text-theme-muted flex items-center gap-3 font-mono text-xs">
                <Target className="text-theme-accent h-4 w-4 shrink-0" />
                <span>{levelLabel}</span>
              </div>
              <div className="text-theme-muted flex items-center gap-3 font-mono text-xs">
                <Eye className="text-theme-accent h-4 w-4 shrink-0" />
                <span>{t('details.views', { count: job.views ?? 0 })}</span>
              </div>
              <div className="text-theme-muted flex items-center gap-3 font-mono text-xs">
                <FileText className="text-theme-accent h-4 w-4 shrink-0" />
                <span>{t('details.applications', { count: job.applications ?? 0 })}</span>
              </div>
            </div>

            <AppButton variant="careers" onClick={scrollToForm} size="md" className="w-full">
              {t('details.initiateApplication')}
            </AppButton>

            <div className="border-theme-line text-theme-dim mt-6 border-t pt-4 text-center font-mono text-[10px] tracking-widest">
              {t('details.sidebar.orSendTo')}
              <a
                href="mailto:careers@example.com"
                className="text-theme-accent hover:text-theme-accent-hover mt-1 block hover:underline"
              >
                CAREERS@EXAMPLE.COM
              </a>
            </div>
          </div>
        </Frame>
      </Reveal>
    </div>
  );
};
