'use client';

import { AlertTriangle, Target } from 'lucide-react';
import { SectionHeading } from '@/shared/ui';
import { useT } from '@/shared/lib/i18n/client';
import { useInView } from '@/shared/hooks';
import { VALUES } from './constants';

export const PrinciplesSection = () => {
  const { t } = useT('about');
  const { ref: sectionRef, inView } = useInView<HTMLElement>();

  return (
    <section ref={sectionRef}>
      <SectionHeading
        title={t('values.title')}
        description={t('values.description')}
        isMain={false}
      />

      <div className="relative mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Соединительная линия брифинга */}
        <div className="pointer-events-none absolute top-12 right-10 left-10 hidden h-px border-t-2 border-dashed border-[#2dd4bf]/10 md:block" />

        {VALUES.map(({ id, Icon, number }, index) => (
          <div
            key={id}
            className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#2dd4bf]/20 bg-[#0a1210]/50 p-6 backdrop-blur-md transition-all duration-300 hover:border-[#2dd4bf]/40 hover:bg-[#0d1f1e]/70 hover:shadow-[0_15px_40px_rgba(45,212,191,0.1)] ${
              inView
                ? 'animate-in fade-in slide-in-from-bottom-8 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:animate-none'
                : 'opacity-0'
            }`}
            style={{
              animationDelay: inView ? `${index * 150}ms` : '0ms',
              animationFillMode: 'both',
            }}
          >
            {/* Фоновая сетка */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(45,212,191,0.06)_1px,transparent_1px)] bg-size-[16px_16px] opacity-40 transition-opacity group-hover:opacity-70" />

            {/* Шапка */}
            <div className="relative z-10 mb-6 flex items-center justify-between border-b border-[#2dd4bf]/10 pb-3">
              <span className="font-mono text-[10px] font-bold tracking-widest text-[#2dd4bf]/70 uppercase">
                [Phase_{number}] // Briefing
              </span>
              <Target className="h-4 w-4 text-[#2dd4bf]/40 transition-colors group-hover:text-[#2dd4bf]" />
            </div>

            {/* Контент */}
            <div className="relative z-10 flex flex-col gap-5">
              <div className="flex items-center gap-4">
                {/* Иконка со скруглением */}
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-[#2dd4bf]/30 bg-[#2dd4bf]/5 text-[#2dd4bf] shadow-[inset_0_0_15px_rgba(45,212,191,0.1)] transition-all duration-300 group-hover:border-[#2dd4bf]/60 group-hover:bg-[#2dd4bf]/10 group-hover:text-[#5eead4]">
                  <Icon size={26} strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-bold tracking-tight text-[#d1faf5]">
                  {t(`values.list.${id}.title`)}
                </h3>
              </div>

              <p className="text-sm leading-relaxed text-slate-400">
                {t(`values.list.${id}.description`)}
              </p>
            </div>

            {/* Футер */}
            <div className="relative z-10 mt-8 flex items-center justify-between border-t border-[#2dd4bf]/10 pt-4">
              <div className="flex items-center gap-2">
                {/* Убрали коралловый цвет, сделали бирюзовым/серым */}
                <AlertTriangle className="h-3.5 w-3.5 text-[#2dd4bf]/60" />
                <span className="font-mono text-[9px] tracking-widest text-[#2dd4bf]/50 uppercase">
                  Objective {number}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#2dd4bf]" />
                <span className="font-mono text-[9px] tracking-widest text-[#2dd4bf]/70 uppercase">
                  Cleared
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
