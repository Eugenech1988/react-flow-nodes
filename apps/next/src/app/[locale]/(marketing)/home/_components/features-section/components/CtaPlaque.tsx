'use client';

import { useT } from '@/shared/lib/i18n/client';
import { AppButton, Rivets } from '@/shared/ui';

export const CtaPlaque = () => {
  const { t } = useT('marketing');

  return (
    <div className="relative flex w-full flex-col overflow-hidden rounded-3xl border-2 border-[#2dd4bf]/50 bg-linear-to-r from-[#0d2422] via-[#0a1615] to-[#0a1615] p-6 shadow-[inset_0_1px_0_rgba(45,212,191,0.15),0_12px_40px_rgba(0,0,0,0.7)] sm:p-8">
      <Rivets className="bg-[#5eead4]/60 sm:h-2.5 sm:w-2.5" />

      <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-[1fr_auto]">
        <div>
          <div className="mb-2 font-mono text-[10px] tracking-[0.3em] text-[#2dd4bf]/70 uppercase">
            {t('features.cta.subtitle')}
          </div>
          <h3 className="text-xl font-bold text-[#d1faf5] sm:text-2xl">
            {t('features.cta.title')}
          </h3>
          <p className="mt-2 text-sm text-[#8db8b4] sm:text-base">
            {t('features.cta.description')}
          </p>
        </div>

        <AppButton
          isLink
          linkTo="http://localhost:5173/login"
          variant="ghost"
          className="group inline-flex h-auto items-center justify-center gap-2 justify-self-start rounded-xl border border-[#2dd4bf]/50 bg-linear-to-b from-[#123332] to-[#06100f] px-6 py-3 font-mono text-xs font-bold tracking-[0.15em] text-[#5eead4] uppercase shadow-[inset_0_1px_0_rgba(45,212,191,0.3),0_4px_12px_rgba(0,0,0,0.5)] transition-all hover:border-[#5eead4] hover:bg-transparent hover:shadow-[inset_0_1px_0_rgba(45,212,191,0.5),0_0_20px_rgba(45,212,191,0.35)] md:justify-self-end"
        >
          {t('features.cta.button')}
        </AppButton>
      </div>
    </div>
  );
};
