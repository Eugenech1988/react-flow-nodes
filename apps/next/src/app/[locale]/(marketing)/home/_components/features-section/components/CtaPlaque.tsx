'use client';

import { useT } from '@/shared/lib/i18n/client';
import { AppButton, Rivets } from '@/shared/ui';
import { APP_LOGIN_URL } from '@/shared/lib/app-url';

export const CtaPlaque = () => {
  const { t } = useT('marketing');

  return (
    <div className="relative flex w-full flex-col overflow-hidden rounded-3xl border-2 border-theme-accent/50 bg-linear-to-r from-theme-raised via-theme-surface to-theme-surface p-5 shadow-[inset_0_1px_0_color-mix(in_oklab,var(--theme-accent)_15%,transparent),0_12px_40px_rgba(0,0,0,0.7)] sm:p-8">
      <Rivets className="bg-theme-accent-hover/60 sm:h-2.5 sm:w-2.5" />

      <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-[1fr_auto]">
        <div>
          <div className="mb-2 font-mono text-[9px] tracking-[0.2em] text-theme-accent/70 uppercase sm:text-[10px] sm:tracking-[0.3em]">
            {t('features.cta.subtitle')}
          </div>
          <h3 className="text-lg font-bold text-theme-fg sm:text-xl md:text-2xl">
            {t('features.cta.title')}
          </h3>
          <p className="mt-2 text-sm text-theme-muted sm:text-base">
            {t('features.cta.description')}
          </p>
        </div>

        <AppButton
          isLink
          linkTo={APP_LOGIN_URL}
          variant="ghost"
          className="group inline-flex h-auto w-full items-center justify-center gap-2 rounded-xl border border-theme-accent/50 bg-linear-to-b from-theme-raised to-theme-bg px-6 py-3 font-mono text-xs font-bold tracking-[0.15em] text-theme-accent-hover uppercase shadow-[inset_0_1px_0_color-mix(in_oklab,var(--theme-accent)_30%,transparent),0_4px_12px_rgba(0,0,0,0.5)] transition-all hover:border-theme-accent-hover hover:bg-transparent hover:shadow-[inset_0_1px_0_color-mix(in_oklab,var(--theme-accent-hover)_50%,transparent),0_0_20px_color-mix(in_oklab,var(--theme-accent)_35%,transparent)] md:w-auto md:justify-self-end"
        >
          {t('features.cta.button')}
        </AppButton>
      </div>
    </div>
  );
};