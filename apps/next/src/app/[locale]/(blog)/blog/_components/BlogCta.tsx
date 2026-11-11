'use client';

import { Mail, Radio } from 'lucide-react';
import { AppButton, AppInput, Reveal, TerminalPanel } from '@/shared/ui';
import { useT } from '@/shared/lib/i18n/client';

const SIGNAL_BARS = [40, 60, 80, 100, 70];

export const BlogCta = () => {
  const { t } = useT('blog');

  return (
    <section className="relative z-10 mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24">
      <Reveal>
        <div className="pointer-events-none absolute -inset-8 -z-10 rounded-[3rem] bg-[radial-gradient(ellipse_at_center,rgba(45,212,191,0.15),transparent_65%)] blur-2xl" />

        <TerminalPanel
          theme="blog"
          headerIcon={Radio}
          headerClassName="text-[#2dd4bf]"
          headerTitle="SUBSCRIBE.CHANNEL // CH-01"
          footer={
            <div className="flex w-full items-center justify-between font-mono text-[10px] tracking-widest text-[#64748b] uppercase">
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#2dd4bf] shadow-[0_0_5px_#2dd4bf]" />
                {t('cta.status')}
              </span>
              <span>RX.TX.READY // 14.250 MHz</span>
            </div>
          }
        >
          <div className="relative px-6 py-12 text-center sm:px-12 sm:py-16">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(45,212,191,0.06)_1px,transparent_1.5px)] bg-size-[16px_16px]" />

            <div className="relative">
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-sm border border-[#2dd4bf]/40 bg-[#0B1424] shadow-[inset_0_0_20px_rgba(45,212,191,0.15)]">
                <Mail className="h-6 w-6 text-[#2dd4bf]" />
              </div>

              <div className="mb-4 flex h-6 items-end justify-center gap-1">
                {SIGNAL_BARS.map((height, i) => (
                  <span
                    key={i}
                    className="w-1.5 animate-pulse rounded-sm bg-[#2dd4bf]/70 motion-reduce:animate-none"
                    style={{ height: `${height}%`, animationDelay: `${i * 150}ms` }}
                  />
                ))}
              </div>

              <h2 className="text-2xl font-bold text-[#e2e8f0] sm:text-3xl">{t('cta.title')}</h2>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-[#94a3b8] sm:text-base">
                {t('cta.description')}
              </p>

              <form className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
                <AppInput
                  type="email"
                  required
                  theme="blog"
                  placeholder={t('cta.placeholder')}
                  className="flex-1"
                />
                <AppButton variant="blog" size="md" type="submit">
                  {t('cta.submit')}
                </AppButton>
              </form>
            </div>
          </div>
        </TerminalPanel>
      </Reveal>
    </section>
  );
};