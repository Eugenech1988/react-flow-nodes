'use client';

import { motion, Variants } from 'framer-motion';
import { Cog, Zap, ShieldCheck, Wrench } from 'lucide-react';
import { SectionHeading, AppButton } from '@/shared/ui';
import { useT } from '@/shared/lib/i18n/client';
import { InquiryModal } from '@/features';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 80 } },
};

export const AboutPage = () => {
  const { t } = useT('marketing');

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
  ];

  return (
    <div className="relative min-h-screen bg-[#040a09] text-[#d1faf5]">
      {/* Фоновые эффекты */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_1px_1px,#5eead4_1px,transparent_0)] bg-size-[22px_22px] opacity-[0.03]" />
      <div className="pointer-events-none absolute top-0 left-1/2 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-[#2dd4bf]/[0.05] blur-[120px]" />

      {/* --- HERO SECTION --- */}
      <section className="relative z-10 px-4 pt-32 pb-16 text-center sm:px-6 sm:pt-40">
        <SectionHeading
          isMain
          title={t('about.hero.title')}
          description={t('about.hero.description')}
          titleClassName="text-4xl sm:text-5xl md:text-6xl"
        />
      </section>

      {/* --- MISSION SECTION --- */}
      <section className="relative z-10 mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
          className="relative overflow-hidden rounded-3xl border border-[#2dd4bf]/30 bg-[#0a1210]/80 p-8 shadow-[inset_0_0_50px_rgba(0,0,0,0.8),0_20px_40px_rgba(0,0,0,0.5)] backdrop-blur-md sm:p-12"
        >
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(45,212,191,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(45,212,191,0.03)_1px,transparent_1px)] bg-size-[2rem_2rem]" />

          <motion.div variants={itemVariants} className="relative z-10">
            <div className="mb-4 flex items-center justify-center gap-2 font-mono text-[10px] tracking-widest text-[#2dd4bf]/70 uppercase sm:text-xs">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#2dd4bf]" />
              {t('about.mission.label')}
            </div>
            <h2 className="mb-6 text-center text-2xl font-bold text-[#d1faf5] sm:text-3xl">
              {t('about.mission.title')}
            </h2>
            <p className="mx-auto max-w-3xl text-center text-sm leading-relaxed text-[#8db8b4] sm:text-base">
              {t('about.mission.description')}
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* --- VALUES SECTION --- */}
      <section className="relative z-10 mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <SectionHeading
          title={t('about.values.title')}
          description={t('about.values.description')}
          isMain={false}
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={containerVariants}
          className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8"
        >
          {values.map((val) => {
            const Icon = val.icon;
            return (
              <motion.div
                key={val.id}
                variants={itemVariants}
                className="group relative flex flex-col items-center overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 p-8 text-center backdrop-blur-md transition-colors hover:border-[#2dd4bf]/50 hover:bg-slate-900/80"
              >
                <span className="absolute top-3 left-3 h-1.5 w-1.5 rounded-full bg-slate-600" />
                <span className="absolute top-3 right-3 h-1.5 w-1.5 rounded-full bg-slate-600" />
                <span className="absolute bottom-3 left-3 h-1.5 w-1.5 rounded-full bg-slate-600" />
                <span className="absolute right-3 bottom-3 h-1.5 w-1.5 rounded-full bg-slate-600" />

                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-[#2dd4bf]/30 bg-[#0a1210] shadow-[inset_0_0_20px_rgba(45,212,191,0.1)] group-hover:scale-110 transition-transform duration-300">
                  <Icon className="h-8 w-8 text-[#2dd4bf] drop-shadow-[0_0_8px_#2dd4bf]" />
                </div>
                <h3 className="mb-3 text-lg font-bold text-slate-100">
                  {t(`about.values.list.${val.id}.title`)}
                </h3>
                <p className="text-sm leading-relaxed text-slate-400">
                  {t(`about.values.list.${val.id}.description`)}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* --- CREW SECTION --- */}
      <section className="relative z-10 mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <SectionHeading
          title={t('about.crew.title')}
          description={t('about.crew.description')}
          isMain={false}
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={containerVariants}
          className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {crew.map((member) => (
            <motion.div
              key={member.id}
              variants={itemVariants}
              className="group relative flex flex-col items-center rounded-2xl border border-slate-800 bg-[#0a1210] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_10px_30px_rgba(0,0,0,0.5)] transition-all hover:-translate-y-2 hover:border-[#2dd4bf]/50 hover:shadow-[0_15px_40px_rgba(45,212,191,0.15)]"
            >
              <div className="relative mb-4 flex h-20 w-20 items-center justify-center rounded-full border-2 border-[#2dd4bf]/30 bg-[#040a09] shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)]">
                <div className="absolute inset-1 rounded-full border border-[#2dd4bf]/10" />
                <span className="font-mono text-xl font-bold text-[#5eead4]">
                  {member.initials}
                </span>
              </div>
              <h4 className="text-base font-bold text-slate-100">
                {t(`about.crew.list.${member.id}.name`)}
              </h4>
              <p className="mt-1 font-mono text-[10px] tracking-widest text-[#2dd4bf]/70 uppercase">
                {t(`about.crew.list.${member.id}.role`)}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="relative z-10 mx-auto max-w-4xl px-4 py-24 text-center sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl border-2 border-[#2dd4bf]/50 bg-linear-to-r from-[#0d2422] via-[#0a1615] to-[#0a1615] p-10 shadow-[inset_0_1px_0_rgba(45,212,191,0.15),0_12px_40px_rgba(0,0,0,0.7)] sm:p-16"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(45,212,191,0.1)_1px,transparent_1px)] bg-size-[2rem_2rem] opacity-20" />

          <h2 className="relative z-10 mb-4 text-2xl font-bold text-[#d1faf5] sm:text-3xl">
            {t('about.cta.title')}
          </h2>
          <p className="relative z-10 mx-auto mb-8 max-w-lg text-sm text-slate-400 sm:text-base">
            {t('about.cta.description')}
          </p>

          <div className="relative z-10 flex justify-center">
            <InquiryModal type="contact">
              <AppButton variant="primary" size="lg" icon={Wrench}>
                {t('about.cta.button')}
              </AppButton>
            </InquiryModal>
          </div>
        </motion.div>
      </section>
    </div>
  );
};