'use client';

import { motion, Variants } from 'framer-motion';
import { Cog, Zap, ShieldCheck, Terminal, ChevronRight, Settings2, Database } from 'lucide-react';
import { SectionHeading, AppButton } from '@/shared/ui';
import { useT } from '@/shared/lib/i18n/client';
import { InquiryModal } from '@/features';

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

export default function AboutPage() {
  const { t } = useT('about');

  const values = [
    { id: '1', icon: Cog },
    { id: '2', icon: Zap },
    { id: '3', icon: ShieldCheck },
  ];

  const crew = [
    { id: '1', initials: 'ED' },
    { id: '2', initials: 'JS' },
    { id: '3', initials: 'MT' },
    { id: '4', initials: 'ER' },
    { id: '5', initials: 'VV' },
    { id: '6', initials: 'SC' },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#040a09] text-[#d1faf5]">
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(45,212,191,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(45,212,191,0.03)_1px,transparent_1px)] bg-size-[4rem_4rem]" />

        <div className="absolute top-0 left-1/2 h-200 w-250 -translate-x-1/2 rounded-full bg-[#2dd4bf]/5 blur-[150px]" />

        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 60, ease: 'linear' }}
          className="absolute -top-40 -left-40 opacity-5"
        >
          <Cog className="h-200 w-200 text-[#2dd4bf]" strokeWidth={0.5} />
        </motion.div>

        <motion.div
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 80, ease: 'linear' }}
          className="absolute top-1/3 -right-40 opacity-5"
        >
          <Settings2 className="h-150 w-150 text-[#2dd4bf]" strokeWidth={0.5} />
        </motion.div>

        <Database
          className="absolute bottom-20 left-10 h-100 w-100 text-[#2dd4bf] opacity-[0.02]"
          strokeWidth={0.5}
        />
      </div>

      <section className="relative z-10 px-4 pt-28 pb-4 text-center sm:px-6 sm:pt-36 sm:pb-8 md:pt-40">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <SectionHeading
            isMain
            title={t('hero.title')}
            description={t('hero.description')}
            titleClassName="text-4xl sm:text-5xl md:text-7xl drop-shadow-[0_0_30px_rgba(45,212,191,0.2)]"
          />
        </motion.div>
      </section>

      <section className="relative z-10 mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12 md:py-16">
        <div className="relative rounded-3xl border border-[#2dd4bf]/20 bg-[#0a1210]/80 p-6 shadow-[inset_0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-md [clip-path:polygon(0_0,100%_0,100%_calc(100%-30px),calc(100%-30px)_100%,0_100%)] sm:p-8 md:p-10">
          <span className="absolute top-4 left-4 h-2 w-2 rounded-full bg-slate-600" />
          <span className="absolute top-4 right-4 h-2 w-2 rounded-full bg-slate-600" />
          <span className="absolute bottom-4 left-4 h-2 w-2 rounded-full bg-slate-600" />

          <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-[1fr_1.5fr] lg:gap-12">
            <motion.div
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
            </motion.div>

            <motion.div
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
            </motion.div>
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

          <motion.div
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
                <motion.div
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
                    <span className="absolute top-1 left-1 h-1 w-1 rounded-full bg-slate-600" />
                    <span className="absolute top-1 right-1 h-1 w-1 rounded-full bg-slate-600" />
                    <span className="absolute bottom-1 left-1 h-1 w-1 rounded-full bg-slate-600" />
                    <span className="absolute right-1 bottom-1 h-1 w-1 rounded-full bg-slate-600" />
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
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-6xl px-4 pb-6 sm:px-6 sm:pb-0 md:pb-12">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(45,212,191,0.03)_0%,transparent_70%)]" />

        <SectionHeading
          title={t('crew.title')}
          description={t('crew.description')}
          isMain={false}
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={containerVariants}
          className="mt-8 grid grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-6 md:mt-16 lg:grid-cols-3"
        >
          {crew.map((member) => (
            <motion.div
              key={member.id}
              variants={itemVariants}
              whileHover={{ y: -8, rotate: -1 }}
              className="group relative flex flex-col items-center justify-center overflow-hidden bg-[#0a1210] p-6 shadow-[0_15px_30px_rgba(0,0,0,0.6)] transition-all duration-300 [clip-path:polygon(16px_0,100%_0,100%_calc(100%-16px),calc(100%-16px)_100%,0_100%,0_16px)] hover:bg-[#0d1f1e] sm:p-8 md:p-10"
            >
              <div className="absolute inset-0 border-2 border-[#2dd4bf]/10 transition-colors [clip-path:polygon(16px_0,100%_0,100%_calc(100%-16px),calc(100%-16px)_100%,0_100%,0_16px)] group-hover:border-[#2dd4bf]/50" />

              <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_40%,rgba(45,212,191,0.05)_50%,transparent_60%)] bg-size-[200%_200%] opacity-0 transition-opacity duration-500 group-hover:bg-position-[100%_100%] group-hover:opacity-100" />

              <span className="absolute top-3 left-3 h-1.5 w-1.5 rounded-full bg-slate-700 transition-colors group-hover:bg-[#2dd4bf]" />
              <span className="absolute right-3 bottom-3 h-1.5 w-1.5 rounded-full bg-slate-700 transition-colors group-hover:bg-[#2dd4bf]" />

              <div className="relative mb-4 flex h-20 w-20 items-center justify-center rounded-full border-2 border-[#2dd4bf]/30 bg-[#040a09] shadow-[inset_0_0_20px_rgba(0,0,0,0.9)] transition-transform duration-500 group-hover:scale-105 group-hover:border-[#2dd4bf] group-hover:shadow-[0_0_20px_rgba(45,212,191,0.3)] sm:mb-6 sm:h-24 sm:w-24 md:h-28 md:w-28">
                <div className="absolute inset-2 animate-[spin_10s_linear_infinite] rounded-full border border-dashed border-[#2dd4bf]/20" />
                <span className="font-mono text-xl font-bold text-[#5eead4] drop-shadow-[0_0_10px_rgba(45,212,191,0.5)] sm:text-2xl md:text-3xl">
                  {member.initials}
                </span>
              </div>
              <h4 className="text-base font-bold text-slate-100 sm:text-lg">
                {t(`crew.list.${member.id}.name`)}
              </h4>
              <p className="mt-2 rounded-full border border-[#2dd4bf]/20 bg-[#2dd4bf]/5 px-3 py-1 font-mono text-[9px] tracking-widest text-[#2dd4bf]/80 uppercase sm:text-[10px]">
                {t(`crew.list.${member.id}.role`)}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative mx-auto mt-12 flex max-w-4xl flex-col items-center justify-center border border-[#2dd4bf]/30 bg-[#0a1210] p-6 shadow-[inset_0_0_50px_rgba(0,0,0,0.8),0_0_30px_rgba(45,212,191,0.1)] [clip-path:polygon(24px_0,100%_0,100%_calc(100%-24px),calc(100%-24px)_100%,0_100%,0_24px)] sm:mt-16 sm:p-10 md:mt-20 md:p-12"
        >
          <div className="absolute inset-0 border border-[#2dd4bf]/20 [clip-path:polygon(24px_0,100%_0,100%_calc(100%-24px),calc(100%-24px)_100%,0_100%,0_24px)]" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(45,212,191,0.08)_1px,transparent_1px)] bg-size-[1.5rem_1.5rem] opacity-40" />

          <div className="absolute top-6 left-0 h-16 w-1 bg-linear-to-b from-transparent via-[#2dd4bf] to-transparent shadow-[0_0_10px_#2dd4bf] sm:top-10 sm:h-24" />
          <div className="absolute right-0 bottom-6 h-16 w-1 bg-linear-to-b from-transparent via-[#2dd4bf] to-transparent shadow-[0_0_10px_#2dd4bf] sm:bottom-10 sm:h-24" />

          <h2 className="relative z-10 mb-3 text-center text-xl font-bold text-[#d1faf5] drop-shadow-md sm:mb-4 sm:text-2xl md:text-3xl">
            {t('cta.title')}
          </h2>
          <p className="relative z-10 mx-auto mb-6 max-w-lg text-center text-sm text-slate-400 sm:mb-8 sm:text-base">
            {t('cta.description')}
          </p>

          <div className="relative z-10 flex justify-center">
            <InquiryModal type="contact">
              <AppButton variant="primary" size="lg" icon={ChevronRight} iconClassName="order-last">
                {t('cta.button')}
              </AppButton>
            </InquiryModal>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
