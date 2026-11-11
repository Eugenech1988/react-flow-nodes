'use client';

import { ChevronRight, CheckCircle2 } from 'lucide-react';
import { AppButton } from '@/shared/ui';
import { useT } from '@/shared/lib/i18n/client';
import type { TPublicJob } from '@/shared/api';

interface IJobBodyProps {
  job: TPublicJob;
  scrollToForm: () => void;
}

export const JobBody = ({ job, scrollToForm }: IJobBodyProps) => {
  const { t } = useT('careers');

  return (
    <div className="max-w-none">
      {job.description && (
        <div className="mb-8">
          <p className="font-typewriter text-theme-fg text-base sm:text-lg">{job.description}</p>
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
          <h2 className="font-typewriter border-theme-line text-theme-accent-hover mt-10 mb-4 flex items-center gap-2 border-b pb-2 text-lg font-bold tracking-widest uppercase sm:text-xl">
            <ChevronRight className="h-5 w-5" />
            {t('details.responsibilities')}
          </h2>
          <ul className="text-theme-muted space-y-3 font-mono text-sm">
            {job.responsibilities.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="bg-theme-accent/20 text-theme-accent mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-sm">
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
          <h2 className="font-typewriter border-theme-line text-theme-accent-hover mt-10 mb-4 flex items-center gap-2 border-b pb-2 text-lg font-bold tracking-widest uppercase sm:text-xl">
            <ChevronRight className="h-5 w-5" />
            {t('details.requirements')}
          </h2>
          <ul className="text-theme-muted space-y-3 font-mono text-sm">
            {job.requirements.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="bg-theme-accent/20 text-theme-accent mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-sm">
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
