'use client';

import { motion } from 'framer-motion';
import { Quote, Star, Activity, ShieldCheck } from 'lucide-react';
import { SectionHeading, AppButton } from '@/shared/ui';
import { useT } from '@/shared/lib/i18n/client';
import { InquiryModal } from '@/features';
import {
  TESTIMONIALS_DATA,
  TESTIMONIALS_VARIANTS,
  CONTAINER_VARIANTS,
} from '@/widgets/sections/testimonials-section/model';

export const TestimonialsSection = () => {
  const { t } = useT('marketing');

  return (
    <section
      id="testimonials"
      className="relative overflow-hidden border-t border-[#2dd4bf]/10 bg-[#040a09] py-16 text-[#d1faf5] sm:py-24"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#5eead4_1px,transparent_0)] bg-size-[22px_22px] opacity-[0.03]" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-150 w-200 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#2dd4bf]/5 blur-3xl" />

      <Activity className="pointer-events-none absolute top-20 -left-20 h-96 w-96 text-[#2dd4bf]/2" />
      <ShieldCheck className="pointer-events-none absolute -right-20 bottom-20 h-96 w-96 text-[#2dd4bf]/2" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          gradientDirection="left"
          title={t('testimonials.heading.title')}
          description={t('testimonials.heading.description')}
          isMain={false}
        />

        <motion.div
          variants={CONTAINER_VARIANTS}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8"
        >
          {TESTIMONIALS_DATA.map((item) => (
            <motion.div
              key={item.id}
              variants={TESTIMONIALS_VARIANTS}
              whileHover={{ y: -6, rotate: 0, transition: { duration: 0.2 } }}
              className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#2dd4bf]/20 bg-[#0d1f1e]/80 p-6 shadow-[inset_0_1px_0_rgba(45,212,191,0.1),0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur-md transition-colors duration-300 hover:border-[#2dd4bf]/50 hover:shadow-[0_15px_40px_rgba(45,212,191,0.15)] sm:p-8 ${item.rotation}`}
            >
              <span className="absolute top-2 left-2 h-1.5 w-1.5 rounded-full bg-[#2dd4bf]/40 shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)]" />
              <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-[#2dd4bf]/40 shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)]" />
              <span className="absolute bottom-2 left-2 h-1.5 w-1.5 rounded-full bg-[#2dd4bf]/40 shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)]" />
              <span className="absolute right-2 bottom-2 h-1.5 w-1.5 rounded-full bg-[#2dd4bf]/40 shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)]" />

              <Quote className="absolute -top-4 -right-4 h-24 w-24 text-[#2dd4bf]/5 transition-transform duration-500 group-hover:scale-110 group-hover:text-[#2dd4bf]/10" />

              <div className="relative z-10">
                <div className="mb-6 flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-[#2dd4bf] text-[#2dd4bf] drop-shadow-[0_0_5px_rgba(45,212,191,0.5)]"
                    />
                  ))}
                </div>

                <p className="text-sm leading-relaxed text-slate-300 sm:text-base">
                  "{t(`testimonials.list.${item.id}.quote`)}"
                </p>
              </div>

              <div className="relative z-10 mt-8 flex items-center gap-4 border-t border-slate-800/80 pt-6">
                <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-[#2dd4bf]/30 bg-[#0a1210] shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)]">
                  <div className="absolute inset-1 rounded-full border border-[#2dd4bf]/10" />
                  <span className="font-mono text-sm font-bold text-[#5eead4]">
                    {item.initials}
                  </span>
                </div>
                <div>
                  <div className="text-sm font-bold text-[#d1faf5]">
                    {t(`testimonials.list.${item.id}.author`)}
                  </div>
                  <div className="mt-0.5 font-mono text-[10px] tracking-widest text-[#2dd4bf]/70 uppercase">
                    {t(`testimonials.list.${item.id}.role`)}{' '}
                    <span className="text-slate-600">//</span>{' '}
                    {t(`testimonials.list.${item.id}.company`)}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-16 flex justify-center"
        >
          <InquiryModal type="review">
            <AppButton
              variant="ghost"
              size="lg"
              className="border border-[#2dd4bf]/30 bg-[#0a1210] font-mono text-xs tracking-widest text-[#2dd4bf] uppercase hover:border-[#2dd4bf]/60 hover:bg-[#2dd4bf]/10 hover:text-[#5eead4]"
            >
              {t('testimonials.cta')}
            </AppButton>
          </InquiryModal>
        </motion.div>
      </div>
    </section>
  );
};
