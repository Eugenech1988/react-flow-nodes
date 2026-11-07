'use client';

import dynamic from 'next/dynamic';
import { m, Variants } from 'framer-motion';
import Image from 'next/image';
import { Cog, Zap, ShieldCheck, Terminal } from 'lucide-react';
import { SectionHeading, AppButton } from '@/shared/ui';
import { useT } from '@/shared/lib/i18n/client';

const InquiryModal = dynamic(
  () => import('@/features').then((mod) => mod.InquiryModal),
  { ssr: false }
);

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 80 } },
};

const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 80 } },
};

const slideInRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 80 } },
};

const values = [
  { id: '1', icon: Cog },
  { id: '2', icon: Zap },
  { id: '3', icon: ShieldCheck },
];

const crew = [
  { id: '1', avatar: 'https://i.pravatar.cc/150?u=eugene' },
  { id: '2', avatar: 'https://i.pravatar.cc/150?u=jane' },
  { id: '3', avatar: 'https://i.pravatar.cc/150?u=marcus' },
  { id: '4', avatar: 'https://i.pravatar.cc/150?u=elena' },
  { id: '5', avatar: 'https://i.pravatar.cc/150?u=viktor' },
  { id: '6', avatar: 'https://i.pravatar.cc/150?u=sarah' },
];

export function AboutInteractiveContent() {
  const { t } = useT('about');

  return (
    <>
      <section className="relative z-10 mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12 md:py-16">
        <div className="relative rounded-3xl border border-[#2dd4bf]/20 bg-[#0a1210]/80 p-6 shadow-[inset_0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-md [clip-path:polygon(0_0,100%_0,100%_calc(100%-30px),calc(100%-30px)_100%,0_100%)] sm:p-8 md:p-10">
          <span className="absolute top-4 left-4 h-2 w-2 rounded-full bg-slate-600" />
          <span className="absolute top-4 right-4 h-2 w-2 rounded-full bg-slate-600" />
          <span className="absolute bottom-4 left-4 h-2 w-2 rounded-full bg-slate-600" />

          <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-[1fr_1.5fr] lg:gap-12">
            <m.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={slideInLeft}
              className="relative"
            >
              <h2 className="text-3xl font-extrabold tracking-tight text-[#d1faf5] sm:text-4xl md:text-5xl">
                {t('mission.title')}
              </h2>
              <div className="mt-3 h-1 w-20 bg-[#2dd4bf] shadow-[0_0_15px_#2dd4bf] sm:mt-4 sm:w-24" />
              <Terminal className="absolute -bottom-10 -left-10 hidden h-40 w-40 text-[#2dd4bf]/3 sm:block" />
            </m.div>

            <m.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={slideInRight}
              className="relative sm:border-l sm:border-[#2dd4bf]/30 sm:pl-8 lg:pl-10"
            >
              <div className="absolute top-0 -left-1.25 hidden h-2 w-2 rounded-full bg-[#2dd4bf] shadow-[0_0_10px_#2dd4bf] sm:block" />
              <div className="absolute bottom-0 -left-1.25 hidden h-2 w-2 rounded-full bg-[#2dd4bf] shadow-[0_0_10px_#2dd4bf] sm:block" />
              <p className="text-sm leading-relaxed text-slate-400 sm:text-base sm:leading-loose">
                {t('mission.description')}
              </p>
            </m.div>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-4xl px-4 pb-12 sm:px-6 sm:pt-12 sm:pb-20 md:pb-24">
        <SectionHeading
          title={t('values.title')}
          description={t('values.description')}
          isMain={false}
        />

        <div className="relative mt-8 sm:mt-12 md:mt-16">
          <div className="absolute top-0 bottom-0 left-4 w-2 -translate-x-1/2 rounded-full border border-[#2dd4bf]/20 bg-[#0a1210] shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)] sm:left-1/2" />
          <div className="absolute top-0 bottom-0 left-4 w-px -translate-x-1/2 bg-linear-to-b from-transparent via-[#2dd4bf]/60 to-transparent shadow-[0_0_10px_#2dd4bf] sm:left-1/2" />

          <m.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={containerVariants}
            className="flex flex-col gap-8 sm:gap-12 md:gap-16"
          >
            {values.map((val, index) => {
              const Icon = val.icon;
              const isEven = index % 2 === 0;

              return (
                <m.div
                  key={val.id}
                  variants={itemVariants}
                  className={`relative flex items-center gap-4 sm:gap-8 md:gap-12 ${
                    isEven ? 'sm:flex-row' : 'sm:flex-row-reverse'
                  }`}
                >
                  <div className="absolute left-4 z-10 flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full border-2 border-[#2dd4bf] bg-[#040a09] shadow-[0_0_20px_rgba(45,212,191,0.5)] sm:left-1/2 sm:h-10 sm:w-10">
                    <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#5eead4] sm:h-3 sm:w-3" />
                  </div>

                  <div className={`hidden flex-1 sm:block ${isEven ? 'text-right' : 'text-left'}`}>
                    <h3 className="text-xl font-bold text-slate-100">
                      {t(`values.list.${val.id}.title`)}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-400">
                      {t(`values.list.${val.id}.description`)}
                    </p>
                  </div>

                  <div className="relative ml-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-[#2dd4bf]/30 bg-[#0a1210] shadow-[inset_0_0_30px_rgba(45,212,191,0.1)] transition-transform duration-300 hover:scale-110 sm:ml-0 sm:h-20 sm:w-20">
                    <Icon className="h-7 w-7 text-[#2dd4bf] drop-shadow-[0_0_10px_#2dd4bf] sm:h-8 sm:w-8" />
                  </div>

                  <div className="flex-1 pr-2 sm:hidden">
                    <h3 className="text-base font-bold text-slate-100">
                      {t(`values.list.${val.id}.title`)}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-slate-400">
                      {t(`values.list.${val.id}.description`)}
                    </p>
                  </div>

                  <div className="hidden flex-1 sm:block" />
                </m.div>
              );
            })}
          </m.div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-6xl px-4 pb-6 sm:px-6 sm:pb-0 md:pb-12">
        <SectionHeading
          title={t('crew.title')}
          description={t('crew.description')}
          isMain={false}
        />

        <m.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={containerVariants}
          className="mt-8 grid grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-6 md:mt-16 lg:grid-cols-3"
        >
          {crew.map((member) => (
            <m.div
              key={member.id}
              variants={itemVariants}
              whileHover={{ y: -8, rotate: -1 }}
              className="group relative flex flex-col items-center justify-center overflow-hidden bg-[#0a1210] p-6 shadow-[0_15px_30px_rgba(0,0,0,0.6)] transition-all duration-300 [clip-path:polygon(16px_0,100%_0,100%_calc(100%-16px),calc(100%-16px)_100%,0_100%,0_16px)] hover:bg-[#0d1f1e] sm:p-8 md:p-10"
            >
              <div className="relative mb-4 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-2 border-[#2dd4bf]/30 bg-[#040a09] sm:mb-6 sm:h-24 sm:w-24 md:h-28 md:w-28">
                <Image
                  src={member.avatar}
                  alt={t(`crew.list.${member.id}.name`)}
                  fill
                  sizes="(max-width: 640px) 80px, (max-width: 768px) 96px, 112px"
                  className="relative z-10 rounded-full object-cover opacity-80 mix-blend-luminosity grayscale transition-all duration-500 group-hover:opacity-100 group-hover:mix-blend-normal group-hover:grayscale-0"
                />
              </div>

              <h4 className="text-base font-bold text-slate-100 sm:text-lg">
                {t(`crew.list.${member.id}.name`)}
              </h4>
              <p className="mt-2 rounded-full border border-[#2dd4bf]/20 bg-[#2dd4bf]/5 px-3 py-1 font-mono text-[9px] tracking-widest text-[#2dd4bf]/80 uppercase sm:text-[10px]">
                {t(`crew.list.${member.id}.role`)}
              </p>
            </m.div>
          ))}
        </m.div>

        <m.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative mx-auto mt-12 flex max-w-4xl flex-col items-center justify-center border border-[#2dd4bf]/30 bg-[#0a1210] p-6 shadow-[inset_0_0_50px_rgba(0,0,0,0.8)] sm:mt-16 sm:p-10 md:mt-20 md:p-12"
        >
          <h2 className="relative z-10 mb-3 text-center text-xl font-bold text-[#d1faf5] sm:mb-4 sm:text-2xl md:text-3xl">
            {t('cta.title')}
          </h2>
          <p className="relative z-10 mx-auto mb-6 max-w-lg text-center text-sm text-slate-400 sm:mb-8 sm:text-base">
            {t('cta.description')}
          </p>

          <div className="relative z-10 flex justify-center">
            <InquiryModal type="contact">
              <AppButton variant="primary" size="lg">
                {t('cta.button')}
              </AppButton>
            </InquiryModal>
          </div>
        </m.div>
      </section>
    </>
  );
}