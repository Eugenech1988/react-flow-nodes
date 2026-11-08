'use client';

import { AlertTriangle } from 'lucide-react';
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

      <div className="mt-12 grid grid-cols-1 gap-6 sm:mt-16 md:grid-cols-3">
        {VALUES.map(({ id, Icon, number }, index) => (
          <div
            key={id}
            className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#2dd4bf]/20 bg-[#0a1210]/80 p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:border-[#2dd4bf]/50 hover:bg-[#0d1f1e]/90 hover:shadow-[0_15px_40px_rgba(45,212,191,0.15)] ${
              inView
                ? 'animate-in fade-in slide-in-from-bottom-8 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:animate-none'
                : 'opacity-0'
            }`}
            style={{
              animationDelay: inView ? `${index * 120}ms` : '0ms',
              animationFillMode: 'both',
            }}
          >
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(45,212,191,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(45,212,191,0.03)_1px,transparent_1px)] bg-size-[20px_20px] opacity-50" />

            <div className="absolute top-4 right-4 -rotate-12 rounded border-2 border-[#2dd4bf]/20 px-2 py-0.5 font-mono text-[9px] font-bold tracking-widest text-[#2dd4bf]/30">
              CLASSIFIED
            </div>

            <div className="relative z-10">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#2dd4bf]/30 bg-[#2dd4bf]/10 text-[#2dd4bf] transition-colors group-hover:border-[#2dd4bf]/60 group-hover:bg-[#2dd4bf]/20 group-hover:text-[#5eead4]">
                  <Icon size={24} strokeWidth={1.5} />
                </div>
                <span className="font-mono text-3xl font-light text-[#2dd4bf]/20">{number}</span>
              </div>

              <h3 className="text-lg font-bold text-[#d1faf5] sm:text-xl">
                {t(`values.list.${id}.title`)}
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                {t(`values.list.${id}.description`)}
              </p>
            </div>

            <div className="relative z-10 mt-8 flex items-center gap-2 border-t border-[#2dd4bf]/10 pt-4">
              <AlertTriangle className="h-3.5 w-3.5 text-[#2dd4bf]/60" />
              <span className="font-mono text-[9px] tracking-widest text-[#2dd4bf]/50 uppercase">
                Directive {number} / Active
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
