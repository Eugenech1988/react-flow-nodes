'use client';

import { AlertTriangle, ArrowLeft, Wrench, ShieldAlert } from 'lucide-react';
import { useT } from '@/shared/lib/i18n/client';
import { AppButton } from '@/shared/ui';
import { InquiryModal } from '@/features';

export const NotFoundClient = ({ locale }: { locale: string }) => {
  const { t } = useT('common');

  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-[#040a09] text-[#d1faf5]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#5eead4_1px,transparent_0)] bg-size-[22px_22px] opacity-[0.03]" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-125 w-125 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500/5 blur-[100px]" />

      <div className="animate-in fade-in zoom-in-95 relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center px-4 text-center duration-500 ease-out sm:px-6">
        <div
          className="animate-in fade-in slide-in-from-bottom-5 relative mb-12 w-full overflow-hidden rounded-3xl border-2 border-red-500/30 bg-slate-950/80 p-1.5 shadow-[inset_0_0_50px_rgba(0,0,0,0.8),0_20px_40px_rgba(0,0,0,0.5)] backdrop-blur-md duration-500 ease-out sm:p-2"
          style={{ animationDelay: '150ms', animationFillMode: 'both' }}
        >
          <span className="absolute top-3 left-3 h-1.5 w-1.5 rounded-full bg-slate-700 shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)] sm:top-4 sm:left-4 sm:h-2 sm:w-2" />
          <span className="absolute top-3 right-3 h-1.5 w-1.5 rounded-full bg-slate-700 shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)] sm:top-4 sm:right-4 sm:h-2 sm:w-2" />
          <span className="absolute bottom-3 left-3 h-1.5 w-1.5 rounded-full bg-slate-700 shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)] sm:bottom-4 sm:left-4 sm:h-2 sm:w-2" />
          <span className="absolute right-3 bottom-3 h-1.5 w-1.5 rounded-full bg-slate-700 shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)] sm:right-4 sm:bottom-4 sm:h-2 sm:w-2" />

          <div className="relative flex flex-col items-center overflow-hidden rounded-[1.4rem] border border-red-500/20 bg-[#0a0707] px-6 py-12 sm:px-12 sm:py-16">
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(239,68,68,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(239,68,68,0.05)_1px,transparent_1px)] bg-size-[2rem_2rem]" />

            <div className="relative mb-6 flex h-24 w-24 animate-pulse items-center justify-center rounded-full border-2 border-red-500/50 bg-red-500/10 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
              <ShieldAlert className="h-10 w-10 text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.6)]" />
              <div className="absolute -top-1 -right-1 h-4 w-4 animate-pulse rounded-full bg-red-500 shadow-[0_0_10px_#ef4444]" />
            </div>

            <div className="mb-4 flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-1 font-mono text-xs tracking-widest text-red-400 uppercase">
              <AlertTriangle className="h-3 w-3" />
              {t('notFound.systemAlert')}
            </div>

            <h1 className="bg-linear-to-b from-red-500 to-red-900 bg-clip-text font-mono text-6xl font-black text-transparent sm:text-8xl">
              404
            </h1>

            <h2 className="mt-4 text-2xl font-bold text-slate-100 sm:text-3xl">
              {t('notFound.title')}
            </h2>

            <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-400 sm:text-base">
              {t('notFound.description')}
            </p>

            <div className="mt-8 font-mono text-xs text-red-500/50">{t('notFound.errorCode')}</div>
          </div>
        </div>

        <div
          className="animate-in fade-in slide-in-from-bottom-5 flex w-full flex-col items-stretch gap-3 px-2 duration-500 ease-out sm:w-auto sm:flex-row sm:items-center sm:gap-4 sm:px-0"
          style={{ animationDelay: '300ms', animationFillMode: 'both' }}
        >
          <AppButton
            isLink
            linkTo={`/${locale}`}
            variant="primary"
            size="lg"
            icon={ArrowLeft}
            className="w-full justify-center px-4 py-2.5 text-sm sm:w-auto sm:px-6 sm:py-3 sm:text-base"
          >
            {t('notFound.action')}
          </AppButton>

          <div className="w-full sm:w-auto">
            <InquiryModal type="glitch">
              <AppButton
                variant="danger"
                size="lg"
                icon={Wrench}
                className="w-full justify-center px-4 py-2.5 text-sm sm:w-auto sm:px-6 sm:py-3 sm:text-base"
              >
                {t('notFound.report')}
              </AppButton>
            </InquiryModal>
          </div>
        </div>
      </div>
    </div>
  );
};
