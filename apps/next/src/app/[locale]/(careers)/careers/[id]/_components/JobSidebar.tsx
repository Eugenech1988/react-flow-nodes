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
            <div className="flex items-center gap-2 font-mono text-[9px] tracking-widest text-[#6fa28c] uppercase">
              <ShieldAlert className="h-3 w-3" />
              SECURE CHANNEL
            </div>
          }
        >
          <div className="flex flex-col p-6">
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-[#4a5c52] bg-[#0a0e0d] text-[#6fa28c] shadow-[inset_0_0_15px_rgba(111,162,140,0.1)]">
                <Icon className="h-8 w-8" />
              </div>

              <div className="flex h-fit items-center rounded border border-[#6fa28c]/40 bg-[#6fa28c]/10 px-3 py-1.5 font-mono text-[10px] font-bold tracking-widest text-[#9cc4b0] uppercase shadow-[inset_0_1px_0_rgba(156,196,176,0.2)]">
                {deptLabel}
              </div>
            </div>

            <h3 className="font-typewriter mb-2 text-lg font-bold text-[#d4cfc0]">
              {t('details.sidebar.title')}
            </h3>
            <p className="mb-6 font-mono text-xs leading-relaxed text-[#8a9488]">
              {t('details.sidebar.description')}
            </p>

            <div className="mb-8 space-y-4 rounded-lg border border-[#2f3d36]/50 bg-[#0a0e0d]/30 p-4">
              <div className="flex items-center gap-3 font-mono text-xs text-[#8a9488]">
                <MapPin className="h-4 w-4 shrink-0 text-[#6fa28c]" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center gap-3 font-mono text-xs text-[#8a9488]">
                <Target className="h-4 w-4 shrink-0 text-[#6fa28c]" />
                <span>{levelLabel}</span>
              </div>
              <div className="flex items-center gap-3 font-mono text-xs text-[#8a9488]">
                <Eye className="h-4 w-4 shrink-0 text-[#6fa28c]" />
                <span>{t('details.views', { count: job.views ?? 0 })}</span>
              </div>
              <div className="flex items-center gap-3 font-mono text-xs text-[#8a9488]">
                <FileText className="h-4 w-4 shrink-0 text-[#6fa28c]" />
                <span>{t('details.applications', { count: job.applications ?? 0 })}</span>
              </div>
            </div>

            <AppButton variant="careers" onClick={scrollToForm} size="md" className="w-full">
              {t('details.initiateApplication')}
            </AppButton>

            <div className="mt-6 border-t border-[#2f3d36] pt-4 text-center font-mono text-[10px] tracking-widest text-[#4a5c52]">
              {t('details.sidebar.orSendTo')}
              <a
                href="mailto:careers@example.com"
                className="mt-1 block text-[#6fa28c] hover:text-[#9cc4b0] hover:underline"
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
