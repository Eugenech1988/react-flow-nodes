import { SectionHeading, MonitorFrame } from '@/shared/ui';
import { Gauge } from 'lucide-react';
import { getT } from '@/shared/lib/i18n/server';
import { HeroActions, LazyHeroCanvas } from './components';

export const HeroSection = async () => {
  const { t } = await getT('marketing');

  return (
    <div className="relative flex min-h-dvh flex-col justify-center overflow-hidden bg-slate-950 text-slate-100">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(4,47,46,0.4)_1px,transparent_1px),linear-gradient(to_bottom,rgba(4,47,46,0.4)_1px,transparent_1px)] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] bg-size-[4rem_4rem]" />

      <div className="pointer-events-none absolute top-0 left-1/2 h-75 w-150 -translate-x-1/2 rounded-full bg-teal-500/10 blur-3xl" />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center px-4 pt-24 pb-8 text-center sm:px-6 sm:pt-28 sm:pb-16 md:pt-34 lg:px-8">
        <SectionHeading
          isMain
          title={t('hero.title')}
          description={t('hero.description')}
          className="max-w-7xl"
          titleClassName="text-4xl sm:text-5xl md:text-6xl lg:text-7xl"
        />

        <HeroActions />

        <MonitorFrame
          className="mt-8 w-full max-w-5xl rounded-2xl sm:mt-16 sm:rounded-3xl"
          innerClassName="rounded-xl sm:rounded-[1.4rem]"
          headerClassName="px-2 py-1.5 sm:px-6 sm:py-3"
          footerClassName="px-2 py-1.5 sm:px-6 sm:py-3"
          headerTitle={
            <>
              <span className="hidden sm:inline">SYS.WORKSPACE // MAIN_CANVAS.LIVE</span>
              <span className="sm:hidden">SYS.WORKSPACE // LIVE</span>
            </>
          }
          footer={
            <div className="flex w-full items-center justify-between">
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
          }
        >
          <div className="relative flex h-65 w-full items-center justify-center overflow-hidden bg-[#040a09] sm:h-125">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(45,212,191,0.08)_1px,transparent_1.5px)] bg-size-[16px_16px]" />
            <LazyHeroCanvas />
          </div>
        </MonitorFrame>
      </div>
    </div>
  );
};
