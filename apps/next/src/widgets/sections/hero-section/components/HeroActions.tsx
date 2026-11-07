'use client';

import { useParams } from 'next/navigation';
import { AppButton } from '@/shared/ui';
import { ArrowRight, Play } from 'lucide-react';
import { useT } from '@/shared/lib/i18n/client';
import { InquiryModal } from '@/features';

export const HeroActions = () => {
  const { t } = useT('marketing');
  const params = useParams();
  const lng = params.locale;

  return (
    <div className="mt-6 flex w-full flex-col items-center justify-center gap-3 sm:mt-10 sm:flex-row sm:gap-4">
      <AppButton
        isLink
        linkTo={`/${lng}/start`}
        variant="primary"
        size="lg"
        className="group w-full font-bold sm:w-auto"
      >
        {t('hero.cta.primary')}
        <ArrowRight className="h-5 w-5" />
      </AppButton>

      <InquiryModal type="demo">
        <AppButton
          variant="ghost"
          size="lg"
          icon={Play}
          iconClassName="fill-current text-teal-400 drop-shadow-[0_0_4px_rgba(57,179,155,0.6)]"
          className="group w-full border border-white/10 bg-white/5 font-semibold text-neutral-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.18),inset_0_-1px_0_rgba(0,0,0,0.25),0_2px_8px_rgba(0,0,0,0.35)] backdrop-blur-md transition-all duration-300 hover:border-teal-500/30 hover:bg-white/10 hover:text-white hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.18),inset_0_-1px_0_rgba(0,0,0,0.25),0_0_15px_rgba(57,179,155,0.2)] sm:w-auto"
        >
          {t('hero.cta.demo')}
        </AppButton>
      </InquiryModal>
    </div>
  );
};