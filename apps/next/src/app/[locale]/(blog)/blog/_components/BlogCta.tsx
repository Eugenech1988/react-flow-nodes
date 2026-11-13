'use client';

import { useState, type FormEvent } from 'react';
import { Mail, Radio } from 'lucide-react';
import { AppButton, AppInput, Reveal, Frame, SignalBars } from '@/shared/ui';
import { useT } from '@/shared/lib/i18n/client';

export const BlogCta = () => {
  const { t } = useT('blog');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEmail('');
  };

  return (
    <section className="relative z-10 mx-auto max-w-4xl px-4 pb-6">
      <Reveal>
        <div className="pointer-events-none absolute -inset-8 -z-10 rounded-[3rem] bg-[radial-gradient(ellipse_at_center,color-mix(in_oklab,var(--theme-accent)_15%,transparent),transparent_65%)] blur-2xl" />

        <Frame
          theme="blog"
          headerIcon={Radio}
          headerClassName="text-theme-accent"
          headerTitle="SUBSCRIBE.CHANNEL // CH-01"
          footer={
            <div className="text-theme-dim flex w-full items-center justify-between font-mono text-[10px] tracking-widest uppercase">
              <span className="flex items-center gap-2">
                <span className="bg-theme-accent h-1.5 w-1.5 animate-pulse rounded-full shadow-[0_0_5px_var(--theme-accent)]" />
                {t('cta.status')}
              </span>
              <span>RX.TX.READY // 14.250 MHz</span>
            </div>
          }
        >
          <div className="relative px-6 py-12 text-center sm:px-12 sm:py-16">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,color-mix(in_oklab,var(--theme-accent)_6%,transparent)_1px,transparent_1.5px)] bg-size-[16px_16px]" />

            <div className="relative">
              <div className="border-theme-accent/40 bg-theme-panel mb-6 inline-flex h-14 w-14 items-center justify-center rounded-sm border shadow-[inset_0_0_20px_color-mix(in_oklab,var(--theme-accent)_15%,transparent)]">
                <Mail className="text-theme-accent h-6 w-6" />
              </div>

              <div className="mb-4 flex h-6 items-end justify-center gap-1">
                <SignalBars className="justify-center mb-4" />
              </div>

              <h2 className="text-theme-fg text-2xl font-bold sm:text-3xl">{t('cta.title')}</h2>
              <p className="text-theme-muted mx-auto mt-4 max-w-xl text-sm leading-relaxed sm:text-base">
                {t('cta.description')}
              </p>

              <form onSubmit={handleSubmit} className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
                <AppInput
                  type="email"
                  required
                  theme="blog"
                  placeholder={t('cta.placeholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1"
                  aria-label={t('cta.placeholder')}
                />
                <AppButton variant="blog" size="md" type="submit">
                  {t('cta.submit')}
                </AppButton>
              </form>
            </div>
          </div>
        </Frame>
      </Reveal>
    </section>
  );
};