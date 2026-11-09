'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Activity, RadioTower, Send, ShieldCheck } from 'lucide-react';
import {
  MonitorFrame,
  TechCard,
  Reveal,
  AppButton,
  Rivets,
  AppInput,
  AppTextarea,
  AppLabel,
} from '@/shared/ui';
import { useT } from '@/shared/lib/i18n/client';
import { CONTACT_CHANNELS, SOCIAL_NODES, RADAR_BLIPS } from '../constants';

const contactFormSchema = z.object({
  name: z.string().min(2, 'Operator name must be at least 2 characters'),
  email: z.string().email('Please enter a valid return frequency (email)'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message payload must be at least 10 characters'),
});

type TContactFormValues = z.infer<typeof contactFormSchema>;

export const ContactsContent = () => {
  const { t } = useT('contacts');
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  const onSubmit = async (data: TContactFormValues) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log('Form Data:', data);
    setIsSuccess(true);
    reset();
  };

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
              className="h-[300px]"
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

            {isSuccess ? (
              <div className="flex flex-col items-center justify-center py-10 text-center animate-in fade-in zoom-in duration-500 ease-out">

                <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-[#2dd4bf]/40 bg-[#2dd4bf]/10">
                  <span className="absolute inset-0 animate-ping rounded-full border border-[#2dd4bf]/40 opacity-75" style={{ animationDuration: '2s' }} />
                  <span className="absolute -inset-2 animate-pulse rounded-full border border-[#2dd4bf]/20 bg-[#2dd4bf]/5" style={{ animationDuration: '3s' }} />
                  <Send className="relative z-10 h-8 w-8 text-[#5eead4]" />
                </div>

                <h4
                  className="animate-in slide-in-from-bottom-2 fade-in duration-500 text-xl font-bold text-[#d1faf5]"
                  style={{ animationDelay: '150ms', animationFillMode: 'both' }}
                >
                  {t('form.success.title')}
                </h4>

                <p
                  className="mt-2 max-w-xs animate-in slide-in-from-bottom-2 fade-in duration-500 text-sm text-slate-400"
                  style={{ animationDelay: '250ms', animationFillMode: 'both' }}
                >
                  {t('form.success.description')}
                </p>

                <div
                  className="mt-8 animate-in slide-in-from-bottom-2 fade-in duration-500"
                  style={{ animationDelay: '350ms', animationFillMode: 'both' }}
                >
                  <AppButton
                    variant="ghost"
                    onClick={() => setIsSuccess(false)}
                    className="border border-[#2dd4bf]/30 text-[#2dd4bf] transition-colors hover:bg-[#2dd4bf]/10 hover:text-white"
                  >
                    {t('form.success.again')}
                  </AppButton>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-5 animate-in fade-in duration-300"
              >
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <AppLabel htmlFor="name">{t('form.fields.name')}</AppLabel>
                    <AppInput
                      id="name"
                      placeholder={t('form.placeholder.name')}
                      error={!!errors.name}
                      {...register('name')}
                    />
                    {errors.name && <p className="text-xs text-red-400">{errors.name.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <AppLabel htmlFor="email">{t('form.fields.email')}</AppLabel>
                    <AppInput
                      id="email"
                      type="email"
                      placeholder={t('form.placeholder.email')}
                      error={!!errors.email}
                      {...register('email')}
                    />
                    {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <AppLabel htmlFor="subject">{t('form.fields.subject')}</AppLabel>
                  <AppInput
                    id="subject"
                    placeholder={t('form.placeholder.subject')}
                    error={!!errors.subject}
                    {...register('subject')}
                  />
                  {errors.subject && <p className="text-xs text-red-400">{errors.subject.message}</p>}
                </div>

                <div className="space-y-2">
                  <AppLabel htmlFor="message">{t('form.fields.message')}</AppLabel>
                  <AppTextarea
                    id="message"
                    placeholder={t('form.placeholder.message')}
                    rows={5}
                    error={!!errors.message}
                    {...register('message')}
                  />
                  {errors.message && <p className="text-xs text-red-400">{errors.message.message}</p>}
                </div>

                <div className="mt-2 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-2 text-xs text-[#2dd4bf]/60">
                    <Activity className="h-4 w-4 animate-pulse" />
                    <span>{t('form.encrypted')}</span>
                  </div>
                  <AppButton
                    type="submit"
                    variant="primary"
                    size="lg"
                    isPending={isSubmitting}
                    pendingText={t('form.submitting')}
                    icon={Send}
                    className="w-full px-8 sm:w-auto"
                  >
                    {t('form.submit')}
                  </AppButton>
                </div>
              </form>
            )}

            <div className="mt-10 border-t border-[#2dd4bf]/10 pt-6 pb-2">
              <div className="mb-4 font-mono text-[10px] tracking-widest text-[#2dd4bf]/50 uppercase">
                {t('socials.title')}
              </div>
              <div className="flex items-center gap-3">
                {SOCIAL_NODES.map((node) => {
                  const Icon = node.icon;
                  return (
                    <a
                      key={node.id}
                      href="#"
                      title={t(`socials.${node.id}`)}
                      aria-label={t(`socials.${node.id}`)}
                      className="group flex h-11 w-11 items-center justify-center rounded-xl border border-[#2dd4bf]/20 bg-[#040a09] text-slate-400 transition-all duration-300 hover:border-[#2dd4bf]/50 hover:bg-[#2dd4bf]/10 hover:text-[#2dd4bf] hover:shadow-[0_0_15px_rgba(45,212,191,0.2)]"
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
};