'use client';

import { ChevronRight, CheckCircle2 } from 'lucide-react';
import { AppButton } from '@/shared/ui';
import { useT } from '@/shared/lib/i18n/client';
import type { TPublicJob } from '@/shared/api';

interface JobBodyProps {
  job: TPublicJob;
  scrollToForm: () => void;
}

export const JobBody = ({ job, scrollToForm }: JobBodyProps) => {
  const { t } = useT('careers');

  return (
    <div className="max-w-none">
      {job.description && (
        <div className="mb-8">
          <p className="font-typewriter text-base text-[#d4cfc0] sm:text-lg">{job.description}</p>
          <div className="mt-6">
            <AppButton
              onClick={scrollToForm}
              variant="careers"
              size="md"
              className="w-full sm:w-auto"
            >
              {t('details.initiateApplication')}
            </AppButton>
          </div>
        </div>
      )}

      {job.responsibilities.length > 0 && (
        <div>
          <h2 className="font-typewriter mt-10 mb-4 flex items-center gap-2 border-b border-[#2f3d36] pb-2 text-lg font-bold tracking-widest text-[#9cc4b0] uppercase sm:text-xl">
            <ChevronRight className="h-5 w-5" />
            {t('details.responsibilities')}
          </h2>
          <ul className="space-y-3 font-mono text-sm text-[#8a9488]">
            {job.responsibilities.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-sm bg-[#6fa28c]/20 text-[#6fa28c]">
                  <CheckCircle2 className="h-3 w-3" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {job.requirements.length > 0 && (
        <div>
          <h3 className="font-typewriter mt-10 mb-4 flex items-center gap-2 border-b border-[#2f3d36] pb-2 text-lg font-bold tracking-widest text-[#9cc4b0] uppercase sm:text-xl">
            <ChevronRight className="h-5 w-5" />
            {t('details.requirements')}
          </h3>
          <ul className="space-y-3 font-mono text-sm text-[#8a9488]">
            {job.requirements.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-sm bg-[#6fa28c]/20 text-[#6fa28c]">
                  <CheckCircle2 className="h-3 w-3" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
