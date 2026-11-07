import { SectionHeading } from '@/shared/ui';
import { Activity, Gauge } from 'lucide-react';
import { getT } from '@/shared/lib/i18n/server';
import { ClientFlowCanvas, HeroActions } from './components';

export const HeroSection = async () => {
  const { t } = await getT('marketing');

  return (
    <div className="relative flex min-h-dvh flex-col justify-center overflow-hidden bg-slate-950 text-slate-100">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(4,47,46,0.4)_1px,transparent_1px),linear-gradient(to_bottom,rgba(4,47,46,0.4)_1px,transparent_1px)] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] bg-size-[4rem_4rem]" />

      <div className="pointer-events-none absolute top-0 left-1/2 h-75 w-150 -translate-x-1/2 rounded-full bg-teal-500/10 blur-3xl" />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center px-4 pt-24 pb-8 text-center sm:px-6 sm:pt-32 sm:pb-16 lg:px-8">
        <SectionHeading
          isMain
          title={t('hero.title')}
          description={t('hero.description')}
          titleClassName="text-4xl sm:text-5xl md:text-6xl lg:text-7xl"
        />

        <HeroActions />

        <div className="relative mt-8 w-full max-w-5xl rounded-2xl border border-[#2dd4bf]/30 bg-[#0a1210]/60 p-1.5 shadow-[inset_0_0_50px_rgba(0,0,0,0.8),0_20px_40px_rgba(0,0,0,0.5)] backdrop-blur-md sm:mt-16 sm:rounded-3xl sm:p-2">
          <span className="absolute top-2 left-2 h-1.5 w-1.5 rounded-full bg-slate-700 shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)] sm:top-5 sm:left-5 sm:h-2 sm:w-2" />
          <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-slate-700 shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)] sm:top-5 sm:right-5 sm:h-2 sm:w-2" />
          <span className="absolute bottom-2 left-2 h-1.5 w-1.5 rounded-full bg-slate-700 shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)] sm:bottom-5 sm:left-5 sm:h-2 sm:w-2" />
          <span className="absolute right-2 bottom-2 h-1.5 w-1.5 rounded-full bg-slate-700 shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)] sm:right-5 sm:bottom-5 sm:h-2 sm:w-2" />

          <div className="relative flex h-65 w-full flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-950/90 sm:h-125 sm:rounded-[1.4rem]">
            <div className="relative z-10 flex items-center justify-between border-b border-slate-800 bg-[#0d1f1e] px-2 py-1.5 sm:px-6 sm:py-3">
              <div className="flex items-center gap-1.5 font-mono text-[8px] text-[#2dd4bf]/80 sm:gap-2 sm:text-xs">
                <Activity className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">SYS.WORKSPACE // MAIN_CANVAS.LIVE</span>
                <span className="sm:hidden">SYS.WORKSPACE // LIVE</span>
              </div>
              <div className="flex gap-1 sm:gap-1.5">
                <span className="h-1 w-1 rounded-full bg-red-500/50 sm:h-2 sm:w-2" />
                <span className="h-1 w-1 rounded-full bg-yellow-500/50 sm:h-2 sm:w-2" />
                <span className="h-1 w-1 rounded-full bg-green-500/50 shadow-[0_0_5px_#22c55e] sm:h-2 sm:w-2" />
              </div>
            </div>

            <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-[#040a09]">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(45,212,191,0.08)_1px,transparent_1.5px)] bg-size-[16px_16px]" />

              <ClientFlowCanvas />
            </div>

            <div className="relative z-10 flex items-center justify-between border-t border-slate-800 bg-[#0d1f1e] px-2 py-1.5 sm:px-6 sm:py-3">
              <div className="flex items-center gap-1 font-mono text-[7px] text-slate-500 sm:gap-2 sm:text-[10px]">
                <span className="h-1 w-1 animate-pulse rounded-full bg-[#2dd4bf] sm:h-1.5 sm:w-1.5" />
                {t('hero.canvas.status')}
              </div>
              <div className="flex items-center gap-2 sm:gap-4">
                <div className="flex items-center gap-1 sm:gap-2">
                  <span className="font-mono text-[7px] text-slate-500 sm:text-[10px]">
                    {t('hero.canvas.nodes', { count: 3 })}
                  </span>
                  <div className="hidden h-1.5 w-16 overflow-hidden rounded-full bg-slate-800 sm:block">
                    <div className="h-full w-[40%] bg-[#2dd4bf]" />
                  </div>
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <span className="font-mono text-[7px] text-slate-500 sm:text-[10px]">
                    {t('hero.canvas.edges', { count: 2 })}
                  </span>
                  <div className="hidden h-1.5 w-16 overflow-hidden rounded-full bg-slate-800 sm:block">
                    <div className="h-full w-[60%] bg-[#2dd4bf]" />
                  </div>
                </div>
                <Gauge className="hidden h-4 w-4 text-[#2dd4bf] sm:block" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
