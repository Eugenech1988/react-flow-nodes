'use client';

import { AppButton } from '@/shared/ui';
import { Play } from 'lucide-react';
import { useT } from '@/shared/lib/i18n/client';
import { InquiryModal } from '@/features';
import { APP_LOGIN_URL } from '@/shared/lib/app-url';

export const HeroActions = () => {
  const { t } = useT('marketing');

  return (
    <div className="mt-6 flex w-full flex-col items-center justify-center gap-3 sm:mt-10 sm:flex-row sm:gap-4">
      <AppButton
        isLink
        linkTo={APP_LOGIN_URL}
        variant="primary"
        size="lg"
        className="w-full font-bold sm:w-auto"
      >
        {t('hero.cta.primary')}
      </AppButton>

      <InquiryModal type="demo">
        <AppButton
          variant="ghost"
          size="lg"
          icon={Play}
          iconClassName="fill-current text-theme-accent drop-shadow-[0_0_4px_color-mix(in_oklab,var(--theme-accent)_60%,transparent)]"
          className="group w-full border border-theme-line bg-theme-surface font-semibold text-theme-muted shadow-[inset_0_1px_0_rgba(255,255,255,0.18),inset_0_-1px_0_rgba(0,0,0,0.25),0_2px_8px_rgba(0,0,0,0.35)] backdrop-blur-md transition-all duration-300 hover:border-theme-accent/30 hover:bg-theme-panel hover:text-theme-fg hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.18),inset_0_-1px_0_rgba(0,0,0,0.25),0_0_15px_color-mix(in_oklab,var(--theme-accent)_20%,transparent)] sm:w-auto"
        >
          {t('hero.cta.demo')}
        </AppButton>
      </InquiryModal>
    </div>
  );
};