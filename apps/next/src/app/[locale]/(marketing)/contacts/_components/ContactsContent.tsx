'use client';

import { RadioTower, Send, ShieldCheck } from 'lucide-react';
import { MonitorFrame, TechCard, Reveal, Rivets } from '@/shared/ui';
import { useT } from '@/shared/lib/i18n/client';
import { InquiryForm } from '@/entities/inquiry/InquiryForm';
import { SocialLinks } from '@/shared/ui';
import { CONTACT_CHANNELS, RADAR_BLIPS } from '../constants';

export const ContactsContent = () => {
  const { t } = useT('contacts');

  return (
    <div className="relative z-10 mx-auto max-w-6xl px-4 pb-24 sm:px-6">
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_1.2fr] lg:gap-12">
        <div className="flex flex-col gap-8">
          <div className="space-y-4">
            {CONTACT_CHANNELS.map((channel, index) => {
              const Icon = channel.icon;
              return (
                <Reveal key={channel.id} delay={index * 100}>
                  <TechCard className="group w-full overflow-hidden rounded-2xl p-5 sm:p-6">
                    <div className="flex w-full flex-row items-center gap-5 text-left">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#2dd4bf]/30 bg-[#0a1210] text-[#2dd4bf] shadow-[inset_0_0_15px_rgba(45,212,191,0.1)] transition-colors group-hover:border-[#2dd4bf]/60 group-hover:bg-[#2dd4bf]/10">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col items-start">
                        <div className="font-mono text-[9px] tracking-widest text-[#2dd4bf]/50 uppercase">
                          {t(`channels.${channel.id}.label`)}
                        </div>
                        <a
                          href={channel.href}
                          className="mt-1 block w-full truncate text-sm font-semibold text-[#d1faf5] transition-colors hover:text-[#5eead4] sm:text-base"
                        >
                          {t(`channels.${channel.id}.value`)}
                        </a>
                      </div>
                    </div>
                  </TechCard>
                </Reveal>
              );
            })}
          </div>

          <Reveal delay={300}>
            <MonitorFrame
              headerIcon={RadioTower}
              headerTitle={t('radar.title')}
              className="h-75"
              footer={
                <div className="flex w-full items-center justify-between font-mono text-[9px] tracking-widest text-slate-500 uppercase">
                  <span className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#2dd4bf]" />
                    {t('radar.signal')}
                  </span>
                  <span>{t('radar.coordinates')}</span>
                </div>
              }
            >
              <div className="relative h-full w-full overflow-hidden bg-[#040a09]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(45,212,191,0.1)_1px,transparent_1.5px)] bg-size-[16px_16px]" />
                <div className="absolute top-1/2 left-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2">
                  <div className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#2dd4bf]/20" />
                  <div className="absolute top-1/2 left-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#2dd4bf]/30" />
                  <div className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 animate-[spin_4s_linear_infinite] rounded-full bg-[conic-gradient(from_0deg,rgba(45,212,191,0.3),transparent_60deg)]" />
                </div>

                {RADAR_BLIPS.map((blip, i) => (
                  <div
                    key={i}
                    className="absolute h-1.5 w-1.5 animate-ping rounded-full bg-[#2dd4bf] shadow-[0_0_10px_#2dd4bf]"
                    style={{ top: blip.top, left: blip.left, animationDelay: blip.delay }}
                  />
                ))}
              </div>
            </MonitorFrame>
          </Reveal>
        </div>

        <Reveal delay={150} className="relative">
          <div className="relative flex flex-col overflow-hidden rounded-3xl border border-[#2dd4bf]/20 bg-[#0a1210]/60 p-6 shadow-[inset_0_1px_0_rgba(45,212,191,0.1),0_20px_40px_rgba(0,0,0,0.5)] backdrop-blur-md sm:p-8">
            <Rivets className="bg-[#5eead4]/40" />

            <div className="mb-8 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-[#d1faf5]">{t('form.title')}</h3>
                <p className="mt-1 text-sm text-[#8db8b4]">{t('form.description')}</p>
              </div>
              <ShieldCheck className="hidden h-8 w-8 text-[#2dd4bf]/40 sm:block" />
            </div>

            <InquiryForm type="contact" submitIcon={Send} />

            <div className="mt-10 border-t border-[#2dd4bf]/10 pt-6 pb-2">
              <div className="mb-4 font-mono text-[10px] tracking-widest text-[#2dd4bf]/50 uppercase">
                {t('socials.title')}
              </div>
              <div className="flex items-center gap-3">
                <SocialLinks />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
};
